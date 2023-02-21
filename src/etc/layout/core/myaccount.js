import Identify from '@helper/Identify';

export default {
    container: {
        default_delete_button: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/customer/components/customer/deletebutton').default
        },
    },
    content: {
        default_profile: {
            active: true,
            sort_order: 1000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_profile',
                iconName: 'person',
                label: 'Profile',
                extendable: true
            }
        },
        default_address: {
            active: true,
            sort_order: 2000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_address',
                iconName: 'md-book',
                label: 'Address Book',
                extendable: true
            }
        },
        default_order_history: {
            active: true,
            sort_order: 3000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_orders',
                iconName: 'receipt',
                label: 'Order History',
                extendable: true
            }
        },
        default_register_button: {
            active: true,
            sort_order: 4000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_logout',
                iconName: 'md-log-out',
                label: 'Sign Out',
                extendable: false
            }
        },
    }
}