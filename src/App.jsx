import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { useEffect } from 'react';

const fetchData = async ({ pageParam }) => {
  const API = `https://picsum.photos/v2/list?page=${pageParam}`;
  const data = await axios.get(API);
  return data;
};

const App = () => {
  const { data, fetchNextPage, status, error, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['images'],
      queryFn: fetchData,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        return pages.length + 1;
      },
    });
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Image Gallery</h1>
      {status === 'pending' ? (
        <div>Loading...</div>
      ) : status === 'error' ? (
        <div>{error.message}</div>
      ) : (
        data.pages.map((page, i) => {
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
                gap: '1rem',
              }}
            >
              {page.data.map((item) => {
                return (
                  <div key={item.id}>
                    <p>{item.author}</p>
                    <img
                      src={item.download_url}
                      width={500}
                      height={400}
                    />
                  </div>
                );
              })}
            </div>
          );
        })
      )}

      <div
        ref={ref}
        style={{ height: '2rem' }}
      >
        {isFetchingNextPage && 'Loading....'}
      </div>
    </div>
  );
};
export default App;
