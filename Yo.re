module Yo = {
	include ReactRe.Component;
	let name = "Yo";
	type props = {count: int};
	let items = ["1", "2", "3"];
	let done = List.map (
		fun item => {
			<div>(ReactRe.stringToElement item)</div>
		}
	) items;
	let render _ =>
		<div>
			(ReactRe.arrayToElement (Array.of_list done))
		</div>
};

include ReactRe.CreateComponent Yo;
let createElement ::count => wrapProps {count: count};
