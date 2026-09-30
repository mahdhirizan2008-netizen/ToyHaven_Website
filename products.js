const products = [
    {
        id: 1,
        name: 'Classic Honey Teddy',
        category: 'Toys',
        price: 19.99,
        rating: 4.9,
        likes: 224,
        image: 'images/product-01.webp',
        description: 'A soft golden teddy bear made for cosy cuddles and gifts.'
    },
    {
        id: 2,
        name: 'Snowy White Teddy',
        category: 'Toys',
        price: 21.99,
        rating: 4.8,
        likes: 172,
        image: 'images/product-02.webp',
        description: 'A bright white teddy with a gentle stitched smile.'
    },
    {
        id: 3,
        name: 'Sky Blue Teddy',
        category: 'Toys',
        price: 21.49,
        rating: 4.7,
        likes: 154,
        image: 'images/product-03.webp',
        description: 'A soft blue teddy that makes a cheerful collection friend.'
    },
    {
        id: 4,
        name: 'Rose Pink Teddy',
        category: 'Toys',
        price: 22.99,
        rating: 4.8,
        likes: 146,
        image: 'images/product-04.webp',
        description: 'A rosy teddy with a friendly face and a soft finish.'
    },
    {
        id: 5,
        name: 'Castle Building Set',
        category: 'Toys',
        price: 29.99,
        rating: 4.8,
        likes: 184,
        image: 'images/product-05.webp',
        description: 'A colourful building set for castles, stories and creative play.'
    },
    {
        id: 6,
        name: 'City Builder Set',
        category: 'Toys',
        price: 24.99,
        rating: 4.9,
        likes: 212,
        image: 'images/product-06.webp',
        description: 'Build bright city scenes with vehicles and mini adventures.'
    },
    {
        id: 7,
        name: 'Space Explorer Set',
        category: 'Toys',
        price: 26.99,
        rating: 4.9,
        likes: 201,
        image: 'images/product-07.webp',
        description: 'A space-themed build set with ships and exploration pieces.'
    },
    {
        id: 8,
        name: 'Garden House Set',
        category: 'Toys',
        price: 22.49,
        rating: 4.6,
        likes: 118,
        image: 'images/product-08.webp',
        description: 'A colourful little house set for imaginative building.'
    },
    {
        id: 9,
        name: 'Red Sports Car',
        category: 'Diecast Cars',
        price: 14.99,
        rating: 4.7,
        likes: 141,
        image: 'images/product-09.webp',
        description: 'A shiny red miniature sports car for play or display.'
    },
    {
        id: 10,
        name: 'Blue Off-Road Truck',
        category: 'Diecast Cars',
        price: 16.99,
        rating: 4.8,
        likes: 133,
        image: 'images/product-10.webp',
        description: 'A rugged blue off-road vehicle with big collector style.'
    },
    {
        id: 11,
        name: 'Yellow Supercar',
        category: 'Diecast Cars',
        price: 15.99,
        rating: 4.7,
        likes: 126,
        image: 'images/product-11.webp',
        description: 'A bright yellow supercar for miniature racing fun.'
    },
    {
        id: 12,
        name: 'Green Racing Car',
        category: 'Diecast Cars',
        price: 15.49,
        rating: 4.6,
        likes: 109,
        image: 'images/product-12.webp',
        description: 'A sporty green racer with a bold collector look.'
    },
    {
        id: 13,
        name: 'Police Cruiser',
        category: 'Diecast Cars',
        price: 13.99,
        rating: 4.8,
        likes: 119,
        image: 'images/product-13.webp',
        description: 'A detailed miniature police car for imaginative play.'
    },
    {
        id: 14,
        name: 'Fire Rescue Truck',
        category: 'Diecast Cars',
        price: 16.49,
        rating: 4.8,
        likes: 125,
        image: 'images/product-14.webp',
        description: 'A bright fire engine for rescue-themed adventures.'
    },
    {
        id: 15,
        name: 'Rescue Ambulance',
        category: 'Diecast Cars',
        price: 15.99,
        rating: 4.7,
        likes: 101,
        image: 'images/product-15.webp',
        description: 'A miniature ambulance for creative emergency stories.'
    },
    {
        id: 16,
        name: 'Construction Excavator',
        category: 'Diecast Cars',
        price: 18.49,
        rating: 4.8,
        likes: 137,
        image: 'images/product-16.webp',
        description: 'A construction vehicle for dig-and-build play scenes.'
    },
    {
        id: 17,
        name: 'Blue Adventure Blaster',
        category: 'Toys',
        price: 12.99,
        rating: 4.5,
        likes: 92,
        image: 'images/product-17.webp',
        description: 'A colourful foam-style adventure toy for imaginative games.'
    },
    {
        id: 18,
        name: 'Green Adventure Blaster',
        category: 'Toys',
        price: 12.99,
        rating: 4.5,
        likes: 85,
        image: 'images/product-18.webp',
        description: 'A bright green adventure toy for playful action stories.'
    },
    {
        id: 19,
        name: 'Red Adventure Blaster',
        category: 'Toys',
        price: 13.49,
        rating: 4.6,
        likes: 98,
        image: 'images/product-19.webp',
        description: 'A colourful red adventure toy with a fun toy-store look.'
    },
    {
        id: 20,
        name: 'Orange Adventure Blaster',
        category: 'Toys',
        price: 13.99,
        rating: 4.7,
        likes: 107,
        image: 'images/product-20.webp',
        description: 'A bright orange adventure toy for imaginative play.'
    },
    {
        id: 21,
        name: 'Colour Match Game',
        category: 'Board Games',
        price: 19.99,
        rating: 4.6,
        likes: 93,
        image: 'images/product-21.webp',
        description: 'A colourful tabletop game for family game-night fun.'
    },
    {
        id: 22,
        name: 'Remote Control Buggy',
        category: 'Toys',
        price: 31.99,
        rating: 4.9,
        likes: 189,
        image: 'images/product-22.webp',
        description: 'A sporty remote-control buggy ready for indoor adventures.'
    },
    {
        id: 23,
        name: 'Robot Buddy',
        category: 'Figurines',
        price: 27.99,
        rating: 4.8,
        likes: 145,
        image: 'images/product-23.webp',
        description: 'A friendly robot figure ready for imaginative missions.'
    },
    {
        id: 24,
        name: 'Space Rover Adventure',
        category: 'Figurines',
        price: 31.99,
        rating: 4.9,
        likes: 189,
        image: 'images/product-24.webp',
        description: 'A space rover scene for collectors and young explorers.'
    }
];
