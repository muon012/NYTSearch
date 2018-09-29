$(document).ready(function () {
	const nyt = {
		apiKey: `87e9d788d65d4f1a8980fe172f3f9238`,
		apiUrl: `http://api.nytimes.com/svc/search/v2/articlesearch.json?`,

		init: function () {
			this.apiUrl = `${this.apiUrl}api-key=${this.apiKey}`
		},
		search: function (params, callback) {
			axios({
				url: this._processParams(params),
				method: 'GET'
			})
				.then(callback)
				.catch(function (err) {
					alert("There was an error while contacting NYT API! Please try later!");
					console.log(err);
				});
		},
		_processParams: function (params) {
			let _url = this.apiUrl;

			for (let property in params) {
				_url += `&${property}=${params[property]}`
			}
			return _url;
		}
	};

	nyt.init();

	// On click events for the Search Button...
	$("#search-button").on("click", function (e) {
		e.preventDefault();
		var searchInput = $("#search-term").val(); // This is the term to be searched.
		var numPapers = $("#numRetrieves").val(); // This will be the number of articles the user wants.
		var initialYear = $("#startYear").val() + "0101"; // This will be the initial date starting from January 1st of the "Start Year" chosen by the user.
		var lastYear = $("#endYear").val() + "1231"; // This will be the ending date ending on December 31st of the "End Year" chosen by the user..

		nyt.search(
			{
				q: searchInput,
				begin_date: initialYear,
				end_date: lastYear
			},
			function (rsp) {
				console.log(rsp.data);
				for(var i = 0; i < numPapers; i++) {

					//  Refer to the layout from the index.html file for the following HTML element creations.

					var newSpanNumber = $("<span>"); // This is the span element with id="numArticle".
					newSpanNumber.attr("class", "badge badge-dark");
					newSpanNumber.text(i + 1);

					var newSpanHeadline = $("<span>"); // This is the span element with id="title".
					newSpanHeadline.text(rsp.data.response.docs[i].headline.main + "; " + rsp.data.response.docs[i].headline.print_headline + "; " + rsp.data.response.docs[i].byline.original + "; " + rsp.data.response.docs[i].source);

					var newH1 = $("<h1>"); // Create the h1 element and add the two previous elements into it.
					newH1.attr("class", "display-4");
					newH1.append([newSpanNumber, newSpanHeadline]);

					var newP = $("<p>"); // This is the p element with id="pubYear".
					newP.text(rsp.data.response.docs[i].pub_date);

					var newA = $("<a>"); // This is the a element with id="website".
					newA.attr("href", rsp.data.response.docs[i].web_url);
					newA.attr("target", "_blank");
					newA.text(rsp.data.response.docs[i].web_url);

					var newTinyDiv = $("<div>"); // Create a div element and add the 3 previous elements to it.
					newTinyDiv.attr("class", "container");
					newTinyDiv.append([newH1, newP, newA]);

					var newBigDiv = $("<div>"); // Create one final div with class="Jumbotron" and add the previous div into it.
					newBigDiv.attr("class", "jumbotron jumbotron-fluid");
					newBigDiv.append(newTinyDiv);

					$("#jbotron").append(newBigDiv); // Add the previous div to the div with id="jbotron".

						
				}
			}
		);

	

	});

	// On click events for the Clear Results Button...
	$("#clear-button").on("click", function(e) {
		e.preventDefault();
		$("#jbotron").empty();
	});


});
