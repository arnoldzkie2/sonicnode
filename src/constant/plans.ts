const PLANS = [
    {
        name: "Wood",
        cpu: "33%",
        ram: 512,
        vram: 1024,
        disk: "6GB",
        price: 1,
        serverSlots: 1,
        description: "Optimal for small Bedrock servers, offering reliable performance",
        players: 4
    },
    {
        name: "Stone",
        cpu: "66%",
        ram: 1024,
        vram: 2048,
        disk: "12GB",
        price: 2,
        serverSlots: 1,
        description: "Suitable for Bedrock servers with enhanced performance and stability.",
        players: 8
    },
    {
        name: "Coal",
        cpu: "100%",
        ram: 1500,
        vram: 3172,
        disk: "18GB",
        price: 3,
        serverSlots: 1,
        description: "Ideal for hosting small Java servers or larger Bedrock servers.",
        players: 10
    },
    {
        name: "Iron",
        cpu: "133%",
        ram: 2048,
        vram: 4096,
        disk: "22GB",
        price: 4,
        serverSlots: 1,
        description: "High-performance plan for Java servers with extensive mods/plugins.",
        players: 20
    },
    {
        name: "Gold",
        cpu: "200%",
        ram: 3172,
        vram: 5120,
        disk: "35GB",
        price: 6,
        serverSlots: 2,
        description: "Optimal for crossplay, supporting both Bedrock and Java servers.",
        players: 30
    },
    {
        name: "Redstone",
        cpu: "200%",
        ram: 5300,
        vram: 6144,
        disk: "55GB",
        price: 9,
        serverSlots: 2,
        description: "Advanced plan for mixed communities needing extensive resources.",
        players: 50
    },
    {
        name: "Lapiz",
        cpu: "300%",
        ram: 8192,
        vram: 7168,
        disk: "80GB",
        price: 12,
        serverSlots: 3,
        description: "Optimized for diverse gameplay preferences in large communities.",
        players: 80
    },
    {
        name: "Diamond",
        cpu: "400%",
        ram: 6144,
        vram: 8192,
        disk: "75GB",
        price: 12,
        serverSlots: 3,
        description: "High-performance plan tailored for resource-intensive communities.",
        players: 80
    },
    {
        name: "Netherite",
        cpu: "600%",
        ram: 16384,
        vram: 16384,
        disk: "170GB",
        price: 25,
        serverSlots: 5,
        description: "Top-tier plan for extensive communities requiring robust server resources.",
        players: 150
    }
];

export { PLANS }