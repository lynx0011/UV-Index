document.querySelector(".use").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            async function makeRequest() {
                try {
                    const result = await axios.post("http://localhost:3000/submit", {
                        loc: `${latitude}, ${longitude}`
                    })

                    document.open();
                    document.write(result.data)
                    document.close()

                } catch (error) {
                    alert(error)
                }  
            }
            makeRequest()
        },
        function(error) {
            let errorMessage = "An unknown error occurred.";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out.";
                    break;
            }
            alert(errorMessage);
        }
    );
})