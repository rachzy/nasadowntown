import {
  NasaAPIMarsPhoto,
  NasaAPIMarsPhotosRequest,
} from '../interfaces/nasa-api/mars-photos';

export const filterPhotosByPayload = (
  photos: NasaAPIMarsPhoto[],
  payload: NasaAPIMarsPhotosRequest
): NasaAPIMarsPhoto[] => {
  console.log(payload);
  const { rover, camera, earthDate, sol } = payload;
  return photos.filter((photo) => {
    const isCameraMatch = camera
      ? photo.camera.name.toLowerCase() === camera.toLowerCase()
      : true;
    const isEarthDateMatch = earthDate
      ? new Date(photo.earth_date).getTime() === earthDate.getTime()
      : true;
    const isSolMatch = sol ? photo.sol === sol : true;
    const isRoverMatch = rover
      ? photo.rover.name.toLowerCase() === rover.toLowerCase()
      : true;
    // const isPageMatch = page ? photo. === page : true;
    return isCameraMatch && isEarthDateMatch && isSolMatch && isRoverMatch;
  });
};
