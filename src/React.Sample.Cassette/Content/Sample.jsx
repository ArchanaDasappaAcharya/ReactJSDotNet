/**
 *  Copyright (c) 2014-Present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */


class CommentsBox extends React.Component {
	static propTypes = {
		initialComments: PropTypes.array.isRequired,
		commentsPerPage: PropTypes.number.isRequired
	};

	state = {
		comments: this.props.initialComments,
		page: 1,
		hasMore: true,
		loadingMore: false
	};

	loadMoreClicked = (evt) => {
		var nextPage = this.state.page + 1;
		this.setState({
			page: nextPage,
			loadingMore: true
		});

		var url = evt.target.href;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function() {
			var data = JSON.parse(xhr.responseText);
			this.setState({
				comments: this.state.comments.concat(data.comments),
				hasMore: data.hasMore,
				loadingMore: false
			});
		}.bind(this);
		xhr.send();
		evt.preventDefault();
	};

	render() {
		var commentNodes = this.state.comments.map(function (comment) {
			return <Comment author={comment.Author}>{comment.Text}</Comment>;
		});

		return (
			<div className="comments">
				<h1>Comments</h1>
				<ol className="commentList">
					{commentNodes}
				</ol>
				{this.renderMoreLink()}
			</div>
		);
	}

	renderMoreLink = () => {
		if (this.state.loadingMore) {
			return <em>Loading...</em>;
		} else if (this.state.hasMore) {
			return (
				<a href={'comments/page-' + (this.state.page + 1)} onClick={this.loadMoreClicked}>
					Load More
				</a>
			);
		} else {
			return <em>No more comments</em>;
		}
	};
}

class Comment extends React.Component {
	static propTypes = {
		author: PropTypes.object.isRequired
	};

	render() {
		return (
			<li>
				<Avatar author={this.props.author} />
				<strong>{this.props.author.Name}</strong>{': '}
				{this.props.children}
			</li>
		);
	}
}

class Avatar extends React.Component {
	static propTypes = {
		author: PropTypes.object.isRequired
	};

	render() {
		return (
			<img
				src={this.getPhotoUrl(this.props.author)}
				alt={'Photo of ' + this.props.author.Name}
				width={50}
				height={50}
				className="commentPhoto"
			/>
		);
	}

	getPhotoUrl = (author) => {
		return 'https://avatars.githubusercontent.com/' + author.GithubUsername + '?s=50';
	};
}
