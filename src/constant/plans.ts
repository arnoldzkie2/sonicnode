const PLANS = [
    {
        name: "Iron",
        cpu: "100%",
        cpu_speed: 2.8,
        ram: 2048,
        disk: "20GB",
        price: 3.49,
        serverSlots: 1,
        description: "Ideal for hosting small Java servers or larger Bedrock servers.",
        players: 10,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-8EM60800AX367290NMZV543A'
        }
    },
    {
        name: "Gold",
        cpu: "200%",
        cpu_speed: 2.8,
        ram: 4096,
        disk: "40GB",
        price: 6.99,
        serverSlots: 1,
        description: "Advanced plan for mixed communities needing extensive resources.",
        players: 20,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-7CF29165AM467003EMZV55TQ'
        }
    },
    {
        name: "Redstone",
        cpu: "150%",
        cpu_speed: 3.7,
        ram: 4096,
        disk: "45GB",
        price: 7.77,
        serverSlots: 1,
        description: "High-performance plan tailored for resource-intensive communities.",
        players: 25,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-53W76428X3926293UMZV57WQ'
        }
    },
    {
        name: "Lapiz",
        cpu: "250%",
        cpu_speed: 2.8,
        ram: 6144,
        disk: "65GB",
        price: 9.99,
        serverSlots: 2,
        description: "Optimized for diverse gameplay preferences in large communities.",
        players: 35,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0GJ74399JP495673UMZV562Q'
        }
    },
    {
        name: "Diamond",
        cpu: "250%",
        cpu_speed: 3.7,
        ram: 8192,
        disk: "90GB",
        price: 14.99,
        serverSlots: 2,
        description: "Optimized for diverse gameplay preferences in large communities.",
        players: 50,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0GJ74399JP495673UMZV562Q'
        }
    },
    {
        name: "Netherite",
        cpu: "350%",
        cpu_speed: 3.7,
        ram: 12288,
        disk: "135GB",
        price: 22.99,
        serverSlots: 3,
        description: "Top-tier plan for extensive communities requiring robust server resources.",
        players: 80,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5RN97315AN158084WMZV6AMQ'
        }
    }
];

export { PLANS }