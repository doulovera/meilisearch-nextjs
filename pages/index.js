import Head from 'next/head'
import Image from 'next/image'

import { useState, useEffect } from 'react';
import { MeiliSearch } from 'meilisearch'

const MEILI_API_KEY = '7KRanVETa7ec6c58787025f4218a24cef168f6318f4d5868ffa44fcecfb94fbe10453d32';

const client = new MeiliSearch({
  host: 'http://localhost:7700',
  headers: {
    Authorization: `Bearer ${MEILI_API_KEY}`,
    'Content-Type': 'application/json',
  }
})

const INDEX = 'movies';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const checkHealthy = async () => {
      const status = await client.isHealthy()
      if (status) {
        client
          .index(INDEX)
          .search(search)
          .then((results) => {
            setMovies(results.hits);
          });
      }
    };
    checkHealthy();
  }, [search]);

  return (
    <div>
      <Head>
        <title>Meilisearch App</title>
      </Head>

      <div className='flex max-h-screen w-full'>
        <aside className='w-1/2 bg-purple-200 h-screen'>
          <h1 className='mt-2 text-2xl text-center font-bold'><u>Meilisearch</u> App with Next</h1>
          <div className='h-5/6 grid place-content-center'>
            <input
              className="border border-black px-8 py-4 rounded-lg text-2xl"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a movie"
              autoFocus={true}
            />
          </div>
        </aside>
        <main className='overflow-y-auto w-full'>
          <div className="p-10">
            {movies?.map((movie) => (
              <div key={movie.id} className="max-w-sm rounded overflow-hidden shadow-lg my-6">
                <div className="h-64 w-full relative">
                  <Image layout="fill" objectFit='cover' src={movie.poster} alt={movie.title} />
                </div>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{movie.title}</div>
                  <p className="text-gray-700 text-base">
                    {movie.overview}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  {
                    movie.genres?.map((genre) => (
                      <span key={genre} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {genre}
                      </span>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}


/*

{
    "id": "100",
    "title": "Lock, Stock and Two Smoking Barrels",
    "poster": "https://image.tmdb.org/t/p/w500/8kSerJrhrJWKLk1LViesGcnrUPE.jpg",
    "overview": "A card shark and his unwillingly-enlisted friends need to make a lot of cash quick after losing a sketchy poker match. To do this they decide to pull a heist on a small-time gang who happen to be operating out of the flat next door.",
    "release_date": 889056000,
    "genres": [
        "Comedy",
        "Crime"
    ]
}

*/