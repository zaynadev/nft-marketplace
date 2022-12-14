import type { NextPage } from 'next'
import {useRef, useState, useEffect} from 'react'
import { useTheme } from 'next-themes';
import { Banner, CreatorCard, NFTCard, SearchBar } from '../components'
import images from '../assets';
import Image from 'next/image';
import { makeid } from '../utils/makeId';

const Home: NextPage = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  const { theme } = useTheme();

  const handleScroll = (direction: any) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

    // check if scrollRef container is overfilling its parentRef container
    const isScrollable = () => {
      const { current } = scrollRef;
      const { current: parent } = parentRef;
  
      if (current?.scrollWidth >= parent?.offsetWidth) return setHideButtons(false);
      return setHideButtons(true);
    };
  
    // if window is resized
    useEffect(() => {
      isScrollable();
      window.addEventListener('resize', isScrollable);
  
      return () => {
        window.removeEventListener('resize', isScrollable);
      };
    });


    const onHandleSearch = (value: any) => {

    };
  
    const onClearSearch = () => {
      
    };

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={(<>Discover, collect, and sell <br /> extraordinary NFTs</>)}
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyle="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            Best Creators
          </h1>

          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
                <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
                  {[6, 7, 8, 9, 10].map((i) => (
                      <CreatorCard
                        rank={i}
                        //@ts-ignore
                        creatorImage={images[`creator${i}`]}
                        creatorName={`0xabc...xyz}`}
                        creatorEths={10 - i * 0.534}
                        key={`creator-${i}`}
                      />
                    ))}
                    {!hideButtons && (
                    <>
                      <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                        <Image src={images.left} layout="fill" objectFit="contain" alt="left_arrow" className={theme === 'light' ? 'filter invert' : undefined} />
                      </div>
                      <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                        <Image src={images.right} layout="fill" objectFit="contain" alt="left_arrow" className={theme === 'light' ? 'filter invert' : undefined} />
                      </div>
                    </>
                  )}
                </div>
          </div>
        </div>

        {/** hot birds */}

        <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot Bids</h1>

                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} clearSearch={onClearSearch} />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <NFTCard
                    nft={{
                      i,
                      name: `Nifty NFT ${i}`,
                      price: (10 - i * 0.534).toFixed(2),
                      seller: `0xabcd...xyz`,
                      owner: `0x0xabcd...xyz`,
                      description: 'Cool NFT on Sale',
                    }}
                    key={`nft-${i}`}
                  />
                ))}
              </div>
            </div>


      </div>
    </div>
  )
}

export default Home
