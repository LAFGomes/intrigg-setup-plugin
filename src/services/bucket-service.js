import { IframeMessageProxy } from 'iframe-message-proxy';

const getInmoConfigFile = async () => {
    try {
        const res = await IframeMessageProxy.sendMessage({
            action: 'sendCommand',
            content: {
                destination: 'MessagingHubService',
                command: {
                    to: 'postmaster@msging.net',
                    method: 'get',
                    uri: '/buckets/client-config-file'
                }
            }
        });
        if (res.status === "failed"){
            return "config file not found";
        }

        return res.response;

    } catch (err) {
        return null;
    }
};

export { getInmoConfigFile };