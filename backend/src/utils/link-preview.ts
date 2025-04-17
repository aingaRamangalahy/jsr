import dns from 'node:dns';
import { getLinkPreview } from 'link-preview-js';
import { LinkMetadata } from '@common/types/resource';

export const getPreview = async (url: string): Promise<LinkMetadata> => {
  try {
    const data = await getLinkPreview(url, {
      timeout: 5_000,
      resolveDNSHost: async (url: string) => {
        return new Promise((resolve, reject) => {
          const hostname = new URL(url).hostname;
          dns.lookup(hostname, (err, address, family) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(address); // if address resolves to localhost or '127.0.0.1' library will throw an error
          });
        });
      },
    });
    return {
      url,
      title: 'title' in data ? data.title : '',
      description: 'description' in data ? data.description : '',
      images: 'images' in data ? data.images : [],
      favicon: data.favicons[0],
    };
  } catch (error: any) {
    console.error('Error fetching metadata:', error.message);
    return {
      url,
      title: '',
      description: '',
      images: [],
      favicon: `${new URL(url).origin}/favicon.ico`,
    };
  }
};
