import Connection from '@base/network/Connection';
import Identify from '@helper/Identify';

export default {
    menu_left_items: [
        {
            active: true,
            key: 'item_chat',
            route_name: "WebViewPage",
            params: {
                uri: Connection.getFullUrl() + 'simiconnector/customchat/index',
                stopUrl: 'https://www.simicart.com/',
                stoptask: true
            },
            label: Identify.__("Chat with us"),
            icon: 'md-chatbubbles',
            is_extend: false,
            is_separator: false,
            position: 620
        }
    ],
}
