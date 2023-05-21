const { showNotification, isNovaExtension } = require("./helpers")

exports.activate = function() {
	nova.workspace.config.set("com.tommasonegri.novatypes.isNovaExtension", isNovaExtension)

	if (nova.workspace.config.get("com.tommasonegri.novatypes.isNovaExtension") && nova.workspace.config.get("com.tommasonegri.novatypes.automaticallyCheckForUpdates")) {
		nova.commands.invoke("com.tommasonegri.novatypes.checkForUpdates", { verbose: false })
	}
}

exports.deactivate = function() {
	nova.workspace.config.remove("com.tommasonegri.novatypes.isNovaExtension")
}

// Generate types declaration command
nova.commands.register("com.tommasonegri.novatypes.generateTypesDeclaration", (workspace) => {
	if (!nova.workspace.config.get("com.tommasonegri.novatypes.isNovaExtension")) return

	const declarationFilePath   = nova.path.join(nova.extension.path, "Scripts", "types", "nova.d.ts")
	const destinationFolderPath = nova.path.join(workspace.path, workspace.config.get("com.tommasonegri.novatypes.destinationFolder"))
	const destinationFilePath   = nova.path.join(destinationFolderPath, "nova.d.ts")

	try {
		if (!workspace.contains(destinationFolderPath)) {
			nova.fs.mkdir(destinationFolderPath)
		}

		nova.fs.remove(destinationFilePath)
		nova.fs.copy(declarationFilePath, destinationFilePath)

		showNotification({
			title: "Types added to the project",
			body: "Enjoy a better Nova development experience."
		})
	} catch (error) {
		nova.workspace.showErrorMessage(error)
		console.error(error)
	}
})

// Check for updates command
nova.commands.register("com.tommasonegri.novatypes.checkForUpdates", (workspace, options = {}) => {
	if (!nova.workspace.config.get("com.tommasonegri.novatypes.isNovaExtension")) return

	const { verbose = true } = options

	const regex = /\/\*\~\*\~\* REFRESH_TOKEN: ([a-zA-Z-0-9]*?) \*\~\*\~\*\//

	try {
		// Get project refresh token
		const projectTypesFolderPath = nova.path.join(workspace.path, workspace.config.get("com.tommasonegri.novatypes.destinationFolder"))
		const projectTypesFilePath   = nova.path.join(projectTypesFolderPath, "nova.d.ts")

		if (!nova.fs.access(projectTypesFilePath, nova.fs.F_OK)) {
			if (verbose) throw new Error("Impossible to check for updates: types declaration file missing.")
			return
		}

		const projectTypesFile    = nova.fs.open(projectTypesFilePath)
		const projectRefreshToken = projectTypesFile.readline()?.match(regex)[1]
		projectTypesFile.close()

		// Get extension refresh token
		const extensionTypesFilePath = nova.path.join(nova.extension.path, "Scripts", "types", "nova.d.ts")

		const extensionTypesFile    = nova.fs.open(extensionTypesFilePath)
		const extensionRefreshToken = extensionTypesFile.readline()?.match(regex)[1]
		extensionTypesFile.close()

		if (extensionRefreshToken && projectRefreshToken) {
			if (extensionRefreshToken != projectRefreshToken) {
				showNotification({
					id: "com.tommasonegri.novatypes.updateAvailable",
					title: "Update available",
					body: "New types available.",
					actions: ["Upgrade", "OK"],
					handler: (response) => {
						if (response.actionIdx == 0) {
							nova.commands.invoke("com.tommasonegri.novatypes.generateTypesDeclaration")
						}
					}
				})
			} else {
				if (!verbose) return

				showNotification({
					id: "com.tommasonegri.novatypes.noUpdateAvailable",
					title: "Types are up to date"
				})
			}
		} else {
			throw new Error("Impossible to check for updates: types declaration refresh token missing.")
		}
	} catch (error) {
		nova.workspace.showErrorMessage(error.message)
		console.error(error.message)
	}
})
