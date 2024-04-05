// mapHelper.tsx

export const getUserCoordinates = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
       if (!navigator.geolocation) {
         reject(new Error('Geolocation is not supported by this browser.'));
       } else {
         navigator.geolocation.getCurrentPosition(
           (position) => {
            console.log("hi from resolve",position.coords.latitude)
             resolve({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
             });
           },
           (error) => {
             reject(error);
           }
         );
       }
    });
   };