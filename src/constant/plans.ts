const PLANS = [
    {
        name: "Wood",
        cpu: "33%",
        ram: 512,
        vram: 1024,
        disk: "6GB",
        price: 1.19,
        serverSlots: 1,
        description: "Optimal for small Bedrock servers, offering reliable performance",
        players: 4,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-7R149165GG9215033MZV5Y7Q'
        }
    },
    {
        name: "Stone",
        cpu: "66%",
        ram: 1024,
        vram: 2048,
        disk: "12GB",
        price: 2.29,
        serverSlots: 1,
        description: "Suitable for Bedrock servers with enhanced performance and stability.",
        players: 8,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5GP15236G4676750HMZV52GI'
        }
    },
    {
        name: "Coal",
        cpu: "100%",
        ram: 1500,
        vram: 3172,
        disk: "18GB",
        price: 3.39,
        serverSlots: 1,
        description: "Ideal for hosting small Java servers or larger Bedrock servers.",
        players: 10,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-93W91776G97503647MZV53AI'
        }
    },
    {
        name: "Iron",
        cpu: "133%",
        ram: 2048,
        vram: 4096,
        disk: "22GB",
        price: 4.49,
        serverSlots: 1,
        description: "High-performance plan for Java servers with extensive mods/plugins.",
        players: 20,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-44H24081JW1484946MZV54KI'
        }
    },
    {
        name: "Gold",
        cpu: "200%",
        ram: 3172,
        vram: 5120,
        disk: "35GB",
        price: 6.69,
        serverSlots: 2,
        description: "Optimal for crossplay, supporting both Bedrock and Java servers.",
        players: 30,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-8EM60800AX367290NMZV543A'
        }
    },
    {
        name: "Redstone",
        cpu: "200%",
        ram: 5300,
        vram: 6144,
        disk: "55GB",
        price: 9.99,
        serverSlots: 2,
        description: "Advanced plan for mixed communities needing extensive resources.",
        players: 50,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-7CF29165AM467003EMZV55TQ'
        }
    },
    {
        name: "Lapiz",
        cpu: "400%",
        ram: 6144,
        vram: 8192,
        disk: "75GB",
        price: 13.99,
        serverSlots: 3,
        description: "High-performance plan tailored for resource-intensive communities.",
        players: 80,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-53W76428X3926293UMZV57WQ'
        }
    },
    {
        name: "Diamond",
        cpu: "300%",
        ram: 8192,
        vram: 7168,
        disk: "80GB",
        price: 13.99,
        serverSlots: 3,
        description: "Optimized for diverse gameplay preferences in large communities.",
        players: 80,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0GJ74399JP495673UMZV562Q'
        }
    },
    {
        name: "Netherite",
        cpu: "600%",
        ram: 16384,
        vram: 16384,
        disk: "170GB",
        price: 27.99,
        serverSlots: 5,
        description: "Top-tier plan for extensive communities requiring robust server resources.",
        players: 150,
        payments: {
            paypal: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5RN97315AN158084WMZV6AMQ'
        }
    }
];

export { PLANS }