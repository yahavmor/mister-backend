import configProd from './prod.js'
import configDev from './dev.js'

export let config

if (process.env.DB_MODE === 'atlas') {
    config = configProd
} else {
    config = configDev
}
