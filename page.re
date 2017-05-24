module Page = {
	include ReactRe.Component;
	let name = "Page";
	type props = {message: string};
	let render {props} =>
		<div className="hey">
			<div className="subhey">
				(ReactRe.stringToElement props.message)
			</div>
			<Yo count=5/>
		</div>
};

include ReactRe.CreateComponent Page;
let createElement ::message => wrapProps {message: message};
