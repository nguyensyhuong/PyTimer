import Identify from '@helper/Identify';

export default {
    menu_left_items: [
        {
            active: true,
            key: 'item_bar_code',
            route_name: "BarCode",
            label: Identify.__("Scan Now"),
            icon: 'md-qr-scanner',
            is_extend: false,
            is_separator: false,
            position: 640
        }
    ],
}