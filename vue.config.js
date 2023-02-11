const {defineConfig} = require('@vue/cli-service')
const imports = '@import "~@/style/variables.sass"'
const additionalData = content => {
	// If there are @use statements, insert the import after the last one,
	// otherwise insert it before all content.
	const match = content.match(/@use "[^']+"/g)
	if (match) {
		const last = match[match.length - 1]
		return content.replace(last, `${last}\n${imports}`)
	} else {
		return `${imports}\n${content}`
	}
}

module.exports = defineConfig({
	transpileDependencies: true,
	css: {
		loaderOptions: {
			sass: {
				additionalData,
			},
		},
	},
})
