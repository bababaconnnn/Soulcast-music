var mongoose = require('mongoose');
var song = require('./models/song'),
    artist = require('./models/artist');


var songData = [
    {
        name:'Better Mistakes',
        artist:['60aae8875ef85a525c4cb6e4'],
        image:'https://upload.wikimedia.org/wikipedia/en/4/43/Bebe_Rexha_-_Better_Mistakes.png',
        lyric: "I  go out all night on my own Fake some love and take somebody home Kiss a stranger just to have a taste But I should probably make better mistakes I could smile and lie right through my teeth And say that you're the only one for me Stay the night and leave without a trace But I should probably make better mistakes Oh-oh, the night before the morning after Oh-oh, somewhere between the tears and laughter I don't realize 'til it's too late, oh, wait I should probably make better mistakes I should dye my hair, I should fuck my ex I should lose my phone, better mistakes I should finally listen to my friends And stop thinking I know better than them 'Cause when I'm wrong, there's no one else to blame So I should probably make better mistakes Oh-oh, the night…"
    }
    // {
    //     name:'Montana',
    //     artist:'Daya',
    //     image:'https://www.genius-lyrics.com/wp-content/uploads/2021/04/Montana-Lyrics-Daya.png',
    //     lyric:"Do you ever think about leaving? Do you ever think about me and you? Running to the country where we got nothing to prove Where we can grow old with new friends Lay low on the weekends Running to the country where we got nothing to lose 'Cause I'm tired of the busy nights Fed up with the city lights No, I don't wanna spend my life in this place I just wanna run away to Montana Livin' at a slower pace with you There's nothing else that I would need if I had ya In Montana I could wipe your tears away if you're crying 'Cause even cowgirls get the blues There's nothing else that I would need if I had ya In Montana I wanna see the sky from a dirt road I wanna feel the air cut through my coat 700 acres, so many new ways to see you And all the seeds of love that we…"
    // },
    // {
    //     name:'Leave The Door Open',
    //     artist:'Bruno Mars,Silk Sonic',
    //     image:'https://e.snmc.io/i/600/s/4d28a2a51cde78d0a1b331e59067f216/8837070',
    //     lyric:"Say baby, say baby, say baby What you doin'? (What you doin'?) Where you at? (Where you at?) Oh, you got plans? (You got plans?) Don't say that (shut yo' trap) I'm sippin' wine (sip, sip) In a robe (drip, drip) I look too good (look too good) To be alone (woo-hoo) My house clean (house clean) My pool warm (pool warm) Just shaved (smooth like a newborn) We should be dancing, romancing, in the east wing And the west wing of this mansion, what's happenin'? I ain't playin' no games Every word that I say Is coming straight from the heart So if you tryna lay in these arms I'ma leave the door open (I'ma leave the door open) I'ma leave the door open, girl (I'ma leave the door open, hopin') That you feel the way I feel And you want me like I want you tonight, baby Tell me"
    // },
    // {
    //     name:'Astronomy',
    //     artist:'Conan Gray',
    //     image:'https://images.genius.com/d38b9d81d6213efd7f51a7b3d9441191.300x300x1.jpg',
    //     lyric:'Astronomy Lyric'
    // },
    // {
    //     name:'Say something',
    //     artist:'Nick willson',
    //     image:'https://musictalkers.com/images/ajaxsearch/disco4.jpg',
    //     lyric:'Say something lyric'
    // },    {
    //     name:"We're Good",
    //     artist:'Dua Lipa',
    //     image:'https://cdns-images.dzcdn.net/images/cover/991f87dda3c2ac4ef7c4e34cade8648a/500x500.jpg',
    //     lyric:"We're Good Lyric"
    // }
];

var artistData = [
    {
        artist: 'Taylor Swift',
        imageArtist: '/images/unnamed.jpg'
    },
    {
        artist: 'Daya',
        imageArtist: '/images/Daya.jpg'
    },
    {
        artist: 'Dua Lipa',
        imageArtist: '/images/dua.jpg'
    }
];


function seedDB(){
    // artist.remove({}, function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log('remove DB complete');
        artistData.forEach(function(seed){
            artist.create(seed, function(err,newSong){
                if(err){
                    console.log(err);
                }else{
                    console.log('New data added');
                }
            });
        });
    // });
}

module.exports = seedDB;