const planName = [
    { name: 'Coal', desc: 'Ideal for starting small Bedrock servers, Coal provides essential features and reliable performance.' },
    { name: 'Iron', desc: 'Designed for growing Java and Bedrock communities, providing enhanced performance and capabilities.' },
    { name: 'Gold', desc: 'Tailored for established Java and Bedrock servers, delivering robust features and reliable performance.' },
    { name: 'Redstone', desc: 'Ideal for Java and Bedrock servers, Redstone offers robust features and reliable performance.' },
    { name: 'Lapiz', desc: 'Optimized for large crossplay networks (Java and Bedrock), with advanced features and excellent performance.' },
    { name: 'Diamond', desc: 'The ultimate selection for top-tier crossplay servers (Java and Bedrock), offering premium features and unmatched performance.' },
];

const serverPlan = {
    cpu: 50,
    ram: 2,
    disk: 10,
    player: 5,
    port: 1,
    price: 175
}

export {serverPlan,planName}