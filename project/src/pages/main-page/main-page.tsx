import { useEffect, useState } from 'react';
import Filter from '../../components/filter/filter';
import Map from '../../components/map/map';
import NoResultsPage from '../../components/no-results-page/no-results-page';
import OffersList from '../../components/offers-list/offers-list';
import PageWrapper from '../../components/page-wrapper/page-wrapper';
import Tabs from '../../components/tabs/tabs';
import { CITY_LIST, Sort } from '../../const';
import { useAppSelector } from '../../hooks';
import { City } from '../../types/cities';
import { Point } from '../../types/map';
import { Offers } from '../../types/offers';
import LoadingScreen from '../loading-screen/loading-screen';

function MainPage(): JSX.Element {
  const offers: Offers = useAppSelector((state) => state.offers);
  const [cityOffers, setCityOffers] = useState<Offers>();
  const [city, setCity] = useState<City>({
    name: 'Paris',
    location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 }
  });
  const [selectedPoint, setSelectedPoint] = useState<Point | undefined>(
    undefined
  );

  const activeCity = useAppSelector((state) => state.city);
  const sorting = useAppSelector((state) => state.sorting);
  const isDataLoading = useAppSelector((state) => state.loading);

  const filteredCityOffers = offers.filter(
    (offer) => offer.city.name === activeCity
  );
  const noResults = cityOffers && cityOffers.length;

  const onActiveChange = (id: number): void => {
    const point =
      id > 0 ? cityOffers?.find((offer) => offer.id === id)?.location : undefined;
    setSelectedPoint(point);
  };

  useEffect(() => {
    if (cityOffers?.length) {
      setCity(cityOffers[0].city);
    }
  }, [cityOffers]);

  useEffect(() => {
    setCityOffers(filteredCityOffers);

    // console.log(city)
    // dispatch(fillOfferList(filteredCityOffers))
  }, [activeCity, offers]);

  useEffect(() => {
    onSortingChange(sorting);
  }, [activeCity, sorting]);

  const onSortingChange = (sort: string): void => {
    if (cityOffers && cityOffers.length) {
      // const filteredCityOffers = cityOffers.filter(
      //   offer => offer.city.name === activeCity
      // )

      const sortedArray: Offers = filteredCityOffers.sort((offer1, offer2) => {
        if (sort === Sort.PriceASC) {
          if (offer1.price > offer2.price) {
            return 1;
          }

          if (offer1.price < offer2.price) {
            return -1;
          }
          return 0;
        } else if (sort === Sort.PriceDESC) {
          if (offer1.price < offer2.price) {
            return 1;
          }

          if (offer1.price > offer2.price) {
            return -1;
          }
          return 0;
        } else if (sort === Sort.RateDESC) {
          if (offer1.rating < offer2.rating) {
            return 1;
          }

          if (offer1.rating > offer2.rating) {
            return -1;
          }
          return 0;
        } else {
          return 0;
        }
      });

      setCityOffers(sortedArray);
    }
  };

  if (isDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <PageWrapper pageClass="page--gray page--main">
      <main
        className={`page__main page__main--index ${
          !noResults ? 'page__main--index-empty' : ''
        }`}
      >
        <h1 className="visually-hidden">Cities</h1>
        <Tabs cities={CITY_LIST} />
        <div className="cities">
          {cityOffers && cityOffers.length ? (
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">
                  {cityOffers.length} places to stay in {activeCity}
                </b>
                <Filter sorting={sorting} />
                <OffersList
                  offers={cityOffers}
                  listClass="cities__places-list tabs__content"
                  cardClass="cities"
                  onActiveChange={onActiveChange}
                />
              </section>
              <div
                className="cities__right-section"
                style={{ width: 'calc(100% - 572px)' }}
              >
                <Map
                  selectedPoint={selectedPoint}
                  offers={cityOffers}
                  city={city}
                  mapClass="cities__map"
                />
              </div>
            </div>
          ) : (
            <NoResultsPage activeCity={activeCity} />
          )}
        </div>
      </main>
    </PageWrapper>
  );
}

export default MainPage;
