/**
 * @param {object} options
 * @param {string} [options.id=null]
 * @param {string} [options.title=null]
 * @param {string} [options.body=null]
 * @param {string[]} [options.actions=null]
 * @param {function(NotificationResponse)} [options.handler=null]
 */
exports.showNotification = function({ id = null, title = null, body = null, actions = null, handler = null}) {
	if (!title) return

	const request = id ? new NotificationRequest(id) : new NotificationRequest()

	request.title = title

	if (body)    request.body    = body
	if (actions) request.actions = actions

	nova.notifications.add(request)
		.then(reply => { if (handler) handler(reply) })
		.catch(err => console.error(err, err.stack))
}

exports.isNovaExtension = function() {
	// Used only by this very extension to prevent file manipulation
	if (nova.workspace.config.get("com.tommasonegri.novatypes.manuallyDisabled")) return false

	if (nova.workspace.path.includes(".novaextension")) return true

	let deepExtensionFound = false
	nova.fs.listdir(nova.workspace.path).forEach(path => {
		if (path.includes(".novaextension")) deepExtensionFound = true
	})
	if (deepExtensionFound) return true

	return false
}()
