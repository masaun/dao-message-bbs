// @flow
import React, { Component } from 'react'
import moment from 'moment'
import PostTokenContract from '../build/contracts/PostToken.json'
import List from './components/List'
import getWeb3 from './utils/getWeb3'

const contract = require('truffle-contract')
const postToken = contract(PostTokenContract)
let postTokenInstance

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
  	  title: '',
  	  content: '',
  	  posts: []
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onTextAreaChange = this.onTextAreaChange.bind(this)
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      postToken.setProvider(this.state.web3.currentProvider)
      this.updatePosts()
    })
    .catch((e) => {
	  console.log(e)
      console.log('Error finding web3.')
    })
  }

  onChange(event) {
    this.setState({ title: event.target.value })
  }

  onTextAreaChange(event) {
	this.setState({ content: event.target.value })
  }

  onSubmit() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      postToken.deployed().then((instance) => {
      	postTokenInstance = instance
        return postTokenInstance.mint(this.state.title, this.state.content, {from: accounts[0], gas: 1000000})
	  }).then((result) => {
	  	let posts = this.state.posts
		const post = {
	      "title": this.state.title,
	      "content": this.state.content,
	      "mintedBy": accounts[0],
	      "mintedAt": moment().unix()
	    }
		posts.unshift(post)
		this.setState({ posts: posts })
	  }).catch((e) => {
	  	console.log('Error mint')
        console.error(e)
	  })
	})
  }

  updatePosts() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      postToken.deployed().then((instance) => {
        postTokenInstance = instance
        return postTokenInstance.getAllPosts({from: accounts[0]})
	  }).then((response) => {
	  	for (let i = 0; i < response.length; i++) {
  			postTokenInstance.getPost(response[i], {from: accounts[0]})
  			.then((response) => {
  				let posts = this.state.posts
  				const post = {
		          "title": response[0].toString(),
		          "content": response[1].toString(),
		          "mintedBy": response[2].toString(),
		          "mintedAt": response[3].toString()
		        }
  				posts.unshift(post)
  				this.setState({ posts: posts })
  			}).catch((e) => {
			  console.log('Error getPost')
	          console.error(e)
		    })
		}
	  }).catch((e) => {
	  	console.log('Error getAllPosts')
        console.error(e)
	  })
  	})
  }

  render() {
  	return (
  		<div>
	  		<div className="hero is-info is-bold">
	  			<div className="hero-body">
	  				<div className="container">
			 			<h1 className="title">Decentralized BBS</h1>
			 			<h2 className="subtitle">匿名掲示板</h2>
		 			</div>
	 			</div>
	 		</div>
	 		<div className="section">
	 			<div className="container">
		 			<h3 className="title is-3">投稿フォーム</h3>
		 			<div className="columns">
			 			<form className="column is-half box" action="javascript:void(0)" onSubmit={this.onSubmit}>
			 				<div className="field">
			 					<label className="label">タイトル</label>
			 					<div className="control">
				 					<input className="input" type="text" value={this.state.title} onChange={this.onChange}  />
			 					</div>
			 				</div>
			 				<div className="field">
			 					<label className="label">本文</label>
			 					<div className="control">
				 					<textarea className="textarea" onChange={this.onTextAreaChange} value={this.state.content}></textarea>
				 				</div>
			 				</div>
				 			<input className="button is-primary" type="submit" value="投稿する" />
			 			</form>
		 			</div>
	 			</div>
 			</div>
 			<div className="section">
	 			<div className="container">
 					<List posts={this.state.posts} />
				</div>
			</div>
 		</div>
	);
  }
}

export default App;