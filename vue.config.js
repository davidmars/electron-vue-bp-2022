module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    "pluginOptions": {
        "electronBuilder": {
            nodeIntegration: true,
            contextIsolation:false,
            builderOptions: {
                appId: "tilty.io.xxxx.yyyy",
                publish: [
                    {
                        "provider": "github",
                        "owner": "davidmarsxxxx",
                        "repo": "xxxx.releases"
                    }
                ],
                asar: true,
                "target": [
                    {
                        "target": "nsis",
                        "arch": [
                            "x64",
                            "ia32"
                        ]
                    }
                ]
            }
        }
    },
}