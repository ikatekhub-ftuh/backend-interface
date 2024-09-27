/**
 * @file subscriber/index.js
 * @description This file contains a custom hook that subscribes to changes in the `useTestingStore` store.
 */
import axios from 'axios';

/**
 * Subscribes to changes in the `useTestingStore` store.
 */
export default function useSubscriber() {
    console.log('From store/subscriber | Subscribing to changes in the store');
}
