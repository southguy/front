import React, { useState, useEffect } from 'react';

function ApiCompo() {
  const [Club, setClub] = useState('10kclub');
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const api_url = `https://json-production-535e.up.railway.app/`;
  const fallbackImage = 'public/available.png';

  async function Getclubapi(url) {
    const res = await fetch(url);
    const resp = await res.json();
    setData(resp);
    setPagination(parsePaginationHeaders(res.headers));
  }

  const handleImageError = (event) => {
    event.target.src = fallbackImage;
  };

  useEffect(() => {
    Getclubapi(`${api_url}${Club}?_page=1&_limit=20`);
  }, [Club]);

  const handleClubChange = (e) => {
    const value = e.target.value;
   
      setClub(value.split('.btc')[0]);
    
  };

  const handlePagination = (url) => {
    Getclubapi(url);
  };

  const handleSearch = () => {
    if (searchValue) {
      const url = `${api_url}${Club}?q=${searchValue}`;
      Getclubapi(url);
    }
  };

  const imageSource = (btc) => {
    const imageName = btc.name.split('.btc')[0];
    const imageUrl = `https://btcdomains.io/images/domain/${imageName}.jpeg`;
    const img = new Image();
    img.src = imageUrl;
    if (img.complete) {
      return imageUrl;
    } else {
      return fallbackImage;
    }
  };

  const parsePaginationHeaders = (headers) => {
    const linkHeader = headers.get('Link');
    if (linkHeader) {
      const links = linkHeader.split(',');
      const paginationData = {};
      links.forEach((link) => {
        const [url, rel] = link.split(';');
        const page = url.match(/_page=(\d+)/)[1];
        const limit = url.match(/_limit=(\d+)/)[1];
        paginationData[rel.match(/"(.+)"/)[1]] = {
          url: url.match(/<(.+)>/)[1],
          page: parseInt(page),
          limit: parseInt(limit),
        };
      });
      return paginationData;
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-row justify-center text-center gap-2 text-bold font-mono mb-3">
        <div>
          <select value={Club} onChange={handleClubChange} className="select w-full max-w-xs select-primary">
            <option disabled value="">Select club</option>
            <option value="10kclub">10kclub</option>
            <option value="firstnames">firstnames</option>
            <option value="4l">4letter</option>
            <option value="100kclub">100kclub</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="btcdomain"
            className="input input-bordered w-full max-w-xs input-primary"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex flex-wrap justify-center">
  {data.map((btc) => (
    <div key={btc.id} className="w-1/2 sm:w-1/4 p-3 shadow">
      <div className="card">
        <figure className="px-10 pt-10">
          <img
            src={imageSource(btc)}
            alt="btcdomain"
            className="rounded-xl max-w-full"
            onError={handleImageError}
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-sm">{btc.name}</h2>
        </div>
      </div>
    </div>
  ))}
</div>

      {pagination && (
        <div className="join flex flex-cols-2 gap-3 justify-center items-center p-3 mb-1">
          {pagination.prev && (
            <button className="join-item btn btn-outline" onClick={() => handlePagination(pagination.prev.url)}>
              Previous Page
            </button>
          )}
          {pagination.next && (
            <button className="join-item btn btn-outline" onClick={() => handlePagination(pagination.next.url)}>
              Next
            </button>
          )}
          {pagination.last && (
            <button className="join-item btn btn-outline" onClick={() => handlePagination(pagination.last.url)}>
              Last Page
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ApiCompo;
