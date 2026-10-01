#!/bin/bash
# 如果你有 Mac（或云端 macOS），可以直接用这个脚本编译并打包未签名的 ipa
# 用法：在工程根目录执行  bash scripts/build-ipa.sh

set -e

if ! command -v xcodegen >/dev/null 2>&1; then
  echo "缺少 XcodeGen，正在尝试用 Homebrew 安装..."
  brew install xcodegen
fi

echo "==> 生成 Xcode 工程"
xcodegen generate

echo "==> 编译（不签名）"
xcodebuild \
  -project XstreeIOS.xcodeproj \
  -scheme XstreeIOS \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  build

APP_PATH="build/Build/Products/Release-iphoneos/XstreeIOS.app"

echo "==> 打包 ipa"
rm -rf Payload
mkdir -p Payload
cp -R "$APP_PATH" Payload/
zip -qry XstreeIOS-unsigned.ipa Payload

echo "完成：$(pwd)/XstreeIOS-unsigned.ipa"
