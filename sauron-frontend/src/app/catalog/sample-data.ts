interface Product {
  id: string;
  name: string;
  category: string;
  compatibility: string[];
  price: number;
  inStock: boolean;
  rating: number;
}


const sampleData: Product[] = [
  {
    id: "1",
    name: "Trijicon RMR Type 2 Red Dot Sight",
    category: "optics",
    compatibility: ["Glock", "Smith & Wesson", "SIG Sauer"],
    price: 699.99,
    inStock: true,
    rating: 4.8
  },
  {
    id: "2",
    name: "Timney AR-15 Competition Trigger",
    category: "triggers",
    compatibility: ["AR-15", "M4", "M16"],
    price: 189.99,
    inStock: true,
    rating: 4.9
  },
  {
    id: "3",
    name: "Criterion 16\" .223 Wylde Barrel",
    category: "barrels",
    compatibility: ["AR-15", "M4"],
    price: 289.99,
    inStock: false,
    rating: 4.7
  },
  {
    id: "4",
    name: "Magpul CTR Stock",
    category: "stocks",
    compatibility: ["AR-15", "M4", "AR-10"],
    price: 59.99,
    inStock: true,
    rating: 4.6
  },
  {
    id: "5",
    name: "Eotech EXPS3 Holographic Sight",
    category: "optics",
    compatibility: ["AR-15", "AR-10", "Shotguns"],
    price: 799.99,
    inStock: true,
    rating: 4.9
  },
  {
    id: "6",
    name: "Geissele Super Dynamic Combat Trigger",
    category: "triggers",
    compatibility: ["AR-15"],
    price: 240.00,
    inStock: true,
    rating: 4.8
  },
  {
    id: "7",
    name: "Faxon 20\" Heavy Fluted Barrel",
    category: "barrels",
    compatibility: ["AR-10", ".308 Win"],
    price: 349.99,
    inStock: false,
    rating: 4.5
  },
  {
    id: "8",
    name: "B5 Systems SOPMOD Stock",
    category: "stocks",
    compatibility: ["AR-15", "M4"],
    price: 95.00,
    inStock: true,
    rating: 4.7
  },
  {
    id: "9",
    name: "Vortex Razor HD Gen III",
    category: "optics",
    compatibility: ["AR-15", "AR-10", "Precision Rifles"],
    price: 1999.99,
    inStock: true,
    rating: 5.0
  },
  {
    id: "10",
    name: "LaRue MBT-2S Trigger",
    category: "triggers",
    compatibility: ["AR-15", "AR-10"],
    price: 89.99,
    inStock: true,
    rating: 4.9
  }
];

export default sampleData;
