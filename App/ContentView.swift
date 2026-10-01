import SwiftUI
import UIKit

struct ContentView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {

                Text("ibutv 手机兼容")
                    .font(.largeTitle).bold()

                Text("这是一个 Safari 网页扩展的容器 App。扩展本身不会自动生效，需要你在系统设置里打开它。")
                    .font(.callout)
                    .foregroundStyle(.secondary)

                GroupBox("启用步骤") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("1. 打开「设置」→「Safari」")
                        Text("2. 进入「扩展」")
                        Text("3. 找到并打开「ibutv 兼容」")
                        Text("4. 点进「ibutv 兼容」，允许访问 ibutv.com 及相关网站")
                        Text("5. 回到 Safari，刷新 ibutv.com 页面")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.footnote)
                }

                GroupBox("它做什么") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("• 在 ibutv.com 页面上补发扩展「已就绪」信号，试着解除“需要安装插件”的提示。")
                        Text("• 在 B 站 / 芒果 / 优酷 / 腾讯 / 爱奇艺等播放页右下角加一个「用 ibutv 播放」按钮，点一下把地址交给 ibutv。")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.footnote)
                }

                GroupBox("它做不到什么") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("原版桌面插件用调试器嗅探视频流、改请求头、并连接 ibutv 的授权服务器；Safari 没有这些能力，本扩展也无法复制。因此“需要插件取流”的那部分资源，本扩展不保证能播。")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                }

                Button {
                    if let url = URL(string: "https://ibutv.com/") {
                        UIApplication.shared.open(url)
                    }
                } label: {
                    Label("打开 ibutv.com", systemImage: "safari")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)

                Button {
                    if let url = URL(string: UIApplication.openSettingsURLString) {
                        UIApplication.shared.open(url)
                    }
                } label: {
                    Label("打开系统设置", systemImage: "gearshape")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
            }
            .padding()
        }
    }
}

#Preview {
    ContentView()
}
