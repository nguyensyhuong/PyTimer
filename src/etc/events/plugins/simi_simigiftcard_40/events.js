import Identify from '@helper/Identify';

export default {
    menu_left_items: [
        {
            active: true,
            key: 'item_gift_card',
            route_name: "ListGiftCardProducts",
            label: Identify.__("GiftCard Products"),
            icon: 'md-card',
            is_extend: true,
            is_separator: false,
            position: 640
        },
        {
            active: true,
            key: 'item_check_gift_card',
            route_name: "CheckGiftCode",
            label: Identify.__("Check Gift code"),
            icon: 'md-barcode',
            is_separator: false,
            position: 650
        }
    ],
}