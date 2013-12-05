window.onload = function () {
	var run = Module.cwrap('simulation_run', 'number', ['number'])
	var printSummary = Module.cwrap('simulation_print_summary', 'number', ['number'])
	var printVisits = Module.cwrap('simulation_print_visits', 'number', ['number'])

	var preloaderRenderer = Tempo.prepare("preloader")
	var summaryRenderer = Tempo.prepare("summary")
	var chartTitleRenderer = Tempo.prepare("chart-title")
	var legendRenderer = Tempo.prepare("chart-legend")
	var execTimeRenderer = Tempo.prepare("execution-time")
	var errorRenderer = Tempo.prepare("error")

	var paperWidth = document.getElementById("chart").offsetWidth
	var paperHeight = Math.floor(paperWidth * 0.5)
	var paper = Raphael(document.getElementById("chart"), paperWidth, paperHeight)

	function legend(states)
	{
		var result = []
		for (var i in states) {
			var hsb = Raphael.g.colors[i].match(/(\d*\.\d+)/g) //"hsb(h, s, b)" -> [h, s, b]
			var rgb = Raphael.hsb2rgb(hsb[0], hsb[1], hsb[2])
			result.push({state: states[i], color: rgb.hex})
		}
		return result
	}


	function displaySummary(json, executionTime)
	{
		var result = JSON.parse(json)
		summaryRenderer.render(result)
		execTimeRenderer.render([[executionTime / 1000]])
		preloaderRenderer.clear()
		document.getElementById("output").style.display = "block"
	}


	function displayChart(json, n)
	{
		var ageMax = 150

		var result = JSON.parse(json)

		var xs = []
		for (var i = 0; i <= ageMax; i++) {
			xs.push(i)
		}
		
		var ys = []
		var states = []
		for (var state in result) {
			var freqs = result[state].map(function (x) { return x / n })
			var slicedFreqs = freqs.slice(0, ageMax + 1)
			ys.push(slicedFreqs)
			states.push(state)
		}

		chartTitleRenderer.render([["Estimated probability per age"]])
		
		paper.clear()
		var top = 0, right = 5, bottom = 10, left = 30 //margins
		var w = paper.width - left - right
		var h = paper.height - top - bottom
		var opts = {axis: "0 0 1 1", axisxstep: 20, axisystep: 10}
		paper.linechart(left, top, w, h, xs, ys, opts)

		legendRenderer.render(legend(states))
	}


	function doSubmit(n)
	{
		var asJson = 1

		var start = new Date()
		run(n)
		executionTime = new Date() - start

		var defaultLogger = window.console.log

		window.console.log = function (str) { displaySummary(str, executionTime) }
		printSummary(asJson)
		
		window.console.log = function (str) { displayChart(str, n) }
		printVisits(asJson)
		
		window.console.log = defaultLogger
	}


	function submit(event)
	{
		//clear previous output
		errorRenderer.clear()
		
		var n = document.getElementById("population-size").value
		if (n.match(/^[0-9]+$/)) {
			preloaderRenderer.render([["Executing..."]])
			//set timeout to force page update
			setTimeout(function() { doSubmit(n) }, 100)
		} else {
			errorRenderer.render([[n]])
		}	
		event.preventDefault()
	}
	
	
	function init()
	{
		//register event handlers
		var form = document.getElementById("input")
		form.addEventListener("submit", submit, false)
	
		//hide output
		document.getElementById("output").style.display = "none"
		
		document.getElementById("population-size").select()
	}
	
	init()
}
