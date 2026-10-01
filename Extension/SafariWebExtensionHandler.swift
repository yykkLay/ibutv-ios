import SafariServices
import os.log

/// Safari 网页扩展的原生消息处理器。
/// 本扩展的前端逻辑都在 Resources 里的 JS 中完成，
/// 这里只做最小实现：收到消息就回一个确认。
class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let item = NSExtensionItem()

        if let message = context.inputItems.first as? NSExtensionItem,
           let userInfo = message.userInfo,
           let payload = userInfo[SFExtensionMessageKey] {
            os_log("收到来自扩展的消息: %{public}@", String(describing: payload))
        }

        item.userInfo = [SFExtensionMessageKey: ["ok": true]]
        context.completeRequest(returningItems: [item], completionHandler: nil)
    }
}
