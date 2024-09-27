import { storageLink } from "../axios/config";
import fallbackImage from "@/assets/images/fallback.jpg";

/**
 * App data
 * @type {Object}
 * @file index.js
 * @description This file contains the app data.
 */
export default {
    title: import.meta.env.VITE_APP_TITLE,
    storageLink,
    fallbackImage
}
