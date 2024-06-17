mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: list.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});


const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(list.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${list.title}</h3><p>Exact location will be provided after booking</p>`))
  .addTo(map);

