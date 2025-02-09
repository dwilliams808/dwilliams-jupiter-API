const apiURL = 'https://api.artic.edu/api/v1/artworks?fields=id,title,artist_display,image_id,artist_id&limit=100';
const outputElement = document.getElementById('About');
const imageElement = document.getElementById('IMAGE');
const moreElement = document.getElementById('More');
const artistElement = document.getElementById('Artist'); 

let currentArtworkId = null; 
let currentArtistId = null;

function RandomArt() {
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Artwork data:", data);

            if (!data.data || data.data.length === 0) {
                throw new Error('No artwork data found');
            }

            const art = data.data[Math.floor(Math.random() * data.data.length)];
            currentArtworkId = art.id;
            currentArtistId = art.artist_id;

            const ArtworkTitle = art.title || "...oh actually, it's untitled.";
            const ArtistDescription = art.artist_display || "Unfortunately, we don't have a description of the creator.";

            const imageId = art.image_id;
            const imageURL = imageId ? `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg` : '';

            if (imageURL) {
                imageElement.innerHTML = `<img src="${imageURL}" alt="${ArtworkTitle}" />`;
            } else {
                imageElement.innerHTML = "<p>No image available</p>";
            }

            outputElement.innerHTML = `
                <p>This piece is titled <strong>${ArtworkTitle}</strong>. It was created by <strong>${ArtistDescription}</strong>.</p>
            `;

            moreElement.innerHTML = "";
            artistElement.innerHTML = "";
        })
        .catch(error => {
            console.error('Error:', error);
            outputElement.innerHTML = "<p>Failed to load artwork. Please try again.</p>";
        });
}

function MoreInfo() {
    if (!currentArtworkId) {
        console.error('No artwork selected');
        moreElement.innerHTML = "<p>Please select an artwork first.</p>";
        return;
    }

    fetch(`https://api.artic.edu/api/v1/artworks/${currentArtworkId}?fields=id,title,description`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(artworkDetail => {
            console.log("Artwork detail:", artworkDetail);

            const ArtworkDescription = artworkDetail.data.description || "Unfortunately, we don't have a description of the artwork.";

            moreElement.innerHTML = `
                <p><strong>Description:</strong> ${ArtworkDescription}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching artwork detail:', error);
            moreElement.innerHTML = "<p>Failed to load artwork details. Please try again.</p>";
        });
}

function ArtistInfo() {
    if (!currentArtistId) {
        console.error('No artist selected');
        artistElement.innerHTML = "<p>Sorry, we don't have more information on this artist.</p>";
        return;
    }

    fetch(`https://api.artic.edu/api/v1/agents/${currentArtistId}?fields=id,title,description`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(artistDetail => {
            console.log("Artist detail:", artistDetail);

            const ArtistName = artistDetail.data.title || "Unknown Artist";
            const ArtistDescription = artistDetail.data.description || "Unfortunately, we don't have additional information about the artist.";

            artistElement.innerHTML = `
                <p><strong>Artist:</strong> ${ArtistName}</p>
                <p><strong>About the Artist:</strong> ${ArtistDescription}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching artist detail:', error);
            artistElement.innerHTML = "<p>Failed to load artist details. Please try again.</p>";
        });
}

document.getElementById("artButton").addEventListener("click", RandomArt);
document.getElementById("MoreInfo").addEventListener("click", MoreInfo);
document.getElementById("ArtistInfo").addEventListener("click", ArtistInfo); listener