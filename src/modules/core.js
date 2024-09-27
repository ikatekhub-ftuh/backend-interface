/**
 * @file core.js
 * @description This file contains core functions of helpers
 */

/**
 * String manipulation functions
 * @module mstr
 * @param {string} str - The string to manipulate
 *
 * @example
 * mstr('hello world').capitalize() // Hello world
 * mstr('hello world').capitalize(true) // Hello World
 */
export const mstr = (str) => {
    return {
        capitalize: (eachword = false) => {
            if (eachword) {
                return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            } else {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
        },
    }
}

export const uptoast = (toast, severity, detail, summary = severity, life = 3000) => {
    if (!toast) return
    if (summary) summary = mstr(summary).capitalize(true)
    if (severity) {
        toast.add({ severity, summary, detail, life })
    } else {
        return {
            preset: (options) => {
                switch (options) {
                    case 'error':
                        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Terjadi kesalahan', life })
                        break;
                    case 'cancel':
                        toast.add({ severity: 'warn', summary: 'Dibatalkan', detail: 'Aksi dibatalkan', life })
                        break;
                    case 'success':
                    default:
                        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Aksi sukses dijalankan', life })
                        break;
                }
            }
        }
    }
}
