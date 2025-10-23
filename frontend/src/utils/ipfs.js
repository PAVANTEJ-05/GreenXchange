// utils/ipfs.js
export class IPFSService {
    constructor() {
      this.endpoint = 'https://ipfs.infura.io:5001';
    }
  
    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch(`${this.endpoint}/api/v0/add`, {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        return {
          success: true,
          hash: data.Hash,
          size: data.Size,
          name: file.name
        };
      } catch (error) {
        console.error('IPFS Upload Error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  
    async getFile(hash) {
      try {
        const response = await fetch(`${this.endpoint}/api/v0/cat?arg=${hash}`);
        return await response.blob();
      } catch (error) {
        console.error('IPFS Retrieve Error:', error);
        return null;
      }
    }
  
    generateIPFSLink(hash) {
      return `https://ipfs.io/ipfs/${hash}`;
    }
  
    async verifyDocument(hash, originalHash) {
      return hash === originalHash;
    }
  }
  
  export const ipfsService = new IPFSService();