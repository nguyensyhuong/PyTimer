import Identify from '@helper/Identify';
import openMyGiftCard from '../../../../plugins/giftcard/MyAccountItem';

export default {
    container: {

    },
    content: {
        simi_my_giftcard: {
            active: true,
            sort_order: 3002,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'mygiftcard',
                iconName: 'ios-card',
                label: Identify.__('My Gift Card'),
                extendable: true,
                onClick: openMyGiftCard
            }
        },
    }
}