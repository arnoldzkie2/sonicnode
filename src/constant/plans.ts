const PLANS = [
    {
        name: "coal",
        cpu: 100,
        node: "C-1",
        cpu_speed: 3.2,
        ram: 1536,
        disk: 20,
        price: 300,
        location: "JPN",
        points: 1,
        description: "Affordable option suitable for Bedrock server setups.",
        players: 10,
    },
    {
        name: "iron",
        cpu: 100,
        node: "C-3",
        cpu_speed: 3.2,
        ram: 3072,
        disk: 30,
        price: 400,
        location: "IND",
        points: 1,
        description: "Ideal for hosting small Java servers or larger Bedrock servers.",
        players: 15,
    },
    {
        name: "gold",
        cpu: 150,
        node: "C-2",
        cpu_speed: 3.2,
        ram: 4096,
        disk: 40,
        price: 650,
        location: "SNG",
        points: 1,
        description: "High-performance plan tailored for resource-intensive communities.",
        players: 20,
    },
    {
        name: "lapiz",
        cpu: 200,
        node: "C-3",
        cpu_speed: 3.2,
        ram: 6144,
        disk: 60,
        price: 800,
        location: "IND",
        points: 2,
        description: "Optimized for diverse gameplay preferences in large communities.",
        players: 30,
    },
    {
        name: "diamond",
        cpu: 300,
        node: "C-2",
        cpu_speed: 3.2,
        ram: 8192,
        disk: 80,
        price: 1300,
        location: "SNG",
        points: 2,
        description: "Optimized for powerful server resources in large-scale communities.",
        players: 40,
    }
];

export { PLANS }