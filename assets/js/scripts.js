var API_KEY = 'AIzaSyBXvMnAz7m7D28aBwyWs7DRD7j3aU9XRSs'

$('#search-form').submit(function (e) {
    e.preventDefault();
});

$('#submit').on('click', (e)=>{
    e.preventDefault();
    return search();
});

function search() {
    $('#results').html('');
    $('#buttons').html('')
    query = $('#query').val();
    count = $('#resp').val();
    sort = $('#sort').val();
    if (this.q == 'undefined') {
        this.q = query;
        this.s = sort;
    }
    if (this.q != query || this.c != count){
        $('#load').show();
        results = [];
        this.q = query;
        this.c = count;
    $.get('https://www.googleapis.com/youtube/v3/search',{
        part:'snippet, id',
        q: query,
        maxResults: count,
        key: API_KEY
    },
        function (response) {
            $('#load').hide();
            $.each(response.items, (i, item)=>{
                let output = getJson(item);
                results.push(output);
            });
            displayResults(results);
    });
    }
    else if (sort != "null")
    {
        this.results = sortResults(this.results, sort);
        displayResults(this.results);
    }
    else if (sort == "null")
    {
        displayResults(this.results);
    }
}

function sortResults(results, attr){
    sortedResults = []
    for (i=results.length-1;i>=0;--i){
        for (j=0;j<i;j++){
            if (attr == 'title'){
                if (results[j].title.localeCompare(results[j+1].title) > 0){
                    temp = results[j];
                    results[j] = results[j+1];
                    results[j+1] = temp;
                }
            }
            else if (attr == 'publishedAt'){
                if (results[j].publishedAt.localeCompare(results[j+1].publishedAt) > 0){
                    temp = results[j];
                    results[j] = results[j+1];
                    results[j+1] = temp;
                }
            }
            
        }
    }
    return results
}

function displayResults(results) {
    $('#buttons').html('')
    for (each=0;each<results.length;each++){
        $('#results').append(getString(results[each]));
    }
}

function getString(output) {
    return `<li>
    <div class ="list-left">
    <a href="${output.href}"><img src="${output.thumb}"></a>
    </div>
    <div class="list-right">
    <a href="${output.href}"><h3>${output.title}</h3></a>
    <p>By <span>${output.channelTitle}</span>on ${output.publishedAt}</p>
    <p>${output.description}</p>
    </div>
    `
}

function getJson(item) {
    var object = new Object();
    object["channelTitle"] = item.snippet.channelTitle;
    object["href"] = "https://youtube.com/"
    if (item.id.kind == "youtube#channel")
    {
        object["href"] = object["href"] + "channel/" + item.id.channelId
    }
    else if (item.id.kind == "youtube#video")
    {
        object["href"] = object["href"] + "watch?v=" + item.id.videoId
    }
    else if (item.id.kind == "youtube#playlist")
    {
        tumb_id = item.snippet.thumbnails.default.url.split('/')[4]
        object["href"] = object["href"] + "watch?v=" + tumb_id + "&list=" + item.id.playlistId
    }
    object["title"] = item.snippet.title;
    object["thumb"] = item.snippet.thumbnails.high.url;
    object["publishedAt"] =item.snippet.publishedAt;
    object["description"] = item.snippet.description;
    return object
}
