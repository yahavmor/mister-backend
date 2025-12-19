import { dbService } from '../services/db.service.js'

const labels = [
  'On wheels', 'Box game', 'Art', 'Baby', 'Doll',
  'Puzzle', 'Outdoor', 'Battery Powered'
]

function randomLabels() {
  const shuffled = [...labels].sort(() => Math.random() - 0.5)
  const count = Math.floor(Math.random() * 3) + 1
  return shuffled.slice(0, count)
}

function randomToy(name) {
  return {
    name,
    imgUrl: `https://robohash.org/${Math.random().toString(36).slice(2)}?size=200x200&set=set2`,
    createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24),
    updatedAt: Date.now(),
    price: Math.floor(Math.random() * 350) + 50,
    labels: randomLabels(),
    inStock: Math.random() > 0.5,
    msgs: []
  }
}

const names = [
  "Ravenclaw", "Bloodfang", "Nightshade", "Grimhollow", "Venomira",
  "Skullcrusher", "Hexbane", "Cinderfiend", "Rotfang", "Phantomora",
  "Ghoulspire", "Dreadmire", "Shadowfang", "Cryptbane", "Boneveil",
  "Wraithclaw", "Darkthorn", "Soulreaper", "Ashfang", "Hollowfang",
  "Stormclaw", "Ironbark", "Moonflare", "Starwhisper", "Frostbite",
  "Thunderpaw", "Blazewing", "Mistveil", "Stonegrip", "Wildthorn"
]

async function seedToys() {
  try {
    const collection = await dbService.getCollection('toy')

    const toys = names.map(name => randomToy(name))

    await collection.insertMany(toys)

    console.log('✅ Successfully seeded 30 toys!')
    process.exit()
  } catch (err) {
    console.log('❌ Error seeding toys:', err)
    process.exit(1)
  }
}

seedToys()
