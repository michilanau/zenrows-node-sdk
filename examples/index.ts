/* eslint-disable no-console */
import axios from 'axios';

import { ZenRows } from 'zenrows';

const apiKey = 'YOUR-API-KEY';
const urlLinks = 'https://www.zenrows.com/';
const urlPremium = 'https://www.google.com/search?q=Ariana+Grande';
const testPost = 'https://httpbin.org/anything';

function handleError(error: unknown) {
    console.error((error as Error).message);
    if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
    }
}

(async () => {
    const client = new ZenRows(apiKey, { concurrency: 5, retries: 1 });

    try {
        const { data } = await client.get(urlLinks, {
            // autoparse: true,
            css_extractor: '{"links": "a @href"}',
            // js_render: true,
            // premium_proxy: true,
            // proxy_country: 'us',
        });

        console.log(data);
    } catch (error: unknown) {
        handleError(error);
    }

    try {
        const { data } = await client.get(urlPremium, {
            // autoparse: true,
            css_extractor: '{"stats": "#result-stats", "headers": "#search a > h3"}',
            // js_render: true,
            premium_proxy: true,
            proxy_country: 'us',
        });

        console.log(data);
        /*
            {
                headers: [
                    'Ariana Grande | Home',
                    'Ariana Grande | Facebook',
                    'Best Ariana Grande Songs: 20 Essential Tracks - uDiscover ...',
                    ...
                ],
                stats: 'About 10,700,000 results (0.48 seconds)'
            }
        */
    } catch (error: unknown) {
        handleError(error);
    }

    try {
        const urls = [
            'https://api.ipify.org',
            'https://httpbin.org/ip',
            'https://httpbin.org/anything',
            'https://ident.me',
        ];

        const promises = urls.map((url) => client.get(url));

        const results = await Promise.allSettled(promises);
        const rejected = results.filter(({ status }) => status === 'rejected');
        const fulfilled = results.filter(({ status }) => status === 'fulfilled');

        console.log(rejected);
        console.log(fulfilled);
    } catch (error: unknown) {
        handleError(error);
    }

    try {
        const { data } = await client.post(testPost, {}, {
            data: new URLSearchParams({
                "key1": "value1",
                "key2": "value2",
            }).toString(),
        });

        console.log(data);
        /*
            ...
            form: { key1: 'value1', key2: 'value2' },
            ...
        */
    } catch (error: unknown) {
        handleError(error);
    }
})();
