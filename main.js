const margin = ({top: 30, right: 20, bottom: 20, left: 30});
const width = 800 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;
const padding = 20;

let d;

// CHART INIT ----------------------------------------

const svg = d3.select('.bar-chart').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const xScale = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.1);

const yScale = d3.scaleLinear()
	.range([height, 0]);

const xAxis = d3.axisBottom()
	.scale(xScale)
	.ticks(5, 's');

const yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(6, 's');



svg.append('g')
	.attr('class', 'axis x-axis')
	.attr('transform', `translate(0, ${height})`)
	.call(xAxis);

svg.append('g')
	.attr('class', 'axis y-axis')
	.call(yAxis);

svg.append('text')
	.attr('x', -30)
	.attr('y',  -10)
	.attr('class', 'text')
	.text('# of Stores');



const select = document.querySelector('#group-by');

let type = select.value;

select.onchange = function(e) {
	type = e.target.value;
	update(d, type);
	
}


// CAHRT UPDATE FUNCTION ----------------------------------

function update(data, type) {
	xScale.domain(data.map(d => d.company));

	yScale.domain(d3.extent(data, function(d) { return d[type]; }));

	const bars = svg.selectAll('rect')
		.data(data, function(d) { return d.company});

	bars.enter()
		.append('rect')
		.attr('y', function(d, i) {
			return yScale(d[type]);
		})
		.attr('x', function(d,i) {
			return i * (width / data.length);
		})
		.attr('height', function(d, i) {
			return  height - yScale(d[type]);
		})
		.attr('width', function(d) {
			return xScale.bandwidth();
		})
		.attr('fill', "orange")
		.attr('class', 'rects');

	bars.exit().remove();

	svg.selectAll('.x-axis')
		.call(xAxis);

	svg.selectAll('.y-axis')
		.call(yAxis);

	if(type === 'stores') {
		svg.selectAll('.text')
		.text('# of Stores');
	} else {
		svg.selectAll('.text')
		.text('Revenue');
	}

	

}


// CHART UPDATES -------------------------------------

d3.csv('./data/coffee-house-chains.csv', d3.autoType).then(data => {
	d = data;
	update(d, type);
	console.log(data);
});