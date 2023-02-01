// Mapping trivia cateogry with api call
// Ty Copilot for having all these mapped out already
const categories = [
   { "name": "Any Category", "value": 0 },
   { "name": "General Knowledge", "value": 9 },
   { "name": "Entertainment: Books", "value": 10 },
   { "name": "Entertainment: Film", "value": 11 },
   { "name": "Entertainment: Music", "value": 12 },
   { "name": "Entertainment: Musicals & Theatres", "value": 13 },
   { "name": "Entertainment: Television", "value": 14 },
   { "name": "Entertainment: Video Games", "value": 15 },
   { "name": "Entertainment: Board Games", "value": 16 },
   { "name": "Science & Nature", "value": 17 },
   { "name": "Science: Computers", "value": 18 },
   { "name": "Science: Mathematics", "value": 19 },
   { "name": "Mythology", "value": 20 },
   { "name": "Sports", "value": 21 },
   { "name": "Geography", "value": 22 },
   { "name": "History", "value": 23 },
   { "name": "Politics", "value": 24 },
   { "name": "Art", "value": 25 },
   { "name": "Celebrities", "value": 26 },
   { "name": "Animals", "value": 27 },
   { "name": "Vehicles", "value": 28 },
   { "name": "Entertainment: Comics", "value": 29 },
   { "name": "Science: Gadgets", "value": 30 },
   { "name": "Entertainment: Japanese Anime & Manga", "value": 31 },
   { "name": "Entertainment: Cartoon & Animations", "value": 32 }
 ]
 



export default function CategorySelection({ handleCategoryClick }) {
   return (
      <div>
         <h1>Howdy!</h1>
         <h2>Select a category below to get going on some trivia</h2>
         <div className='App-category-holder'>
            <div className='App-categories-left'>
               {categories.splice(0, Math.ceil(categories.length/2)).map((category, index) => {
                  let categorySelected = category
                  return (
                     <div key={index} className='App-category' onClick={() => {handleCategoryClick(categorySelected)}}>{category.name}</div>
                  )
               })}
            </div>
            <div className='App-categories-right'>
               {categories.splice(Math.ceil(categories.length/2), categories.length).map((category, index) => {
                  let categorySelected = category
                  return (
                     <div key={index} className='App-category' onClick={() => {handleCategoryClick(categorySelected)}}>{category.name}</div>
                  )
               })}
            </div>
         </div>
      </div>
   )
}
