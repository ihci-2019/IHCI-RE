import * as React from 'react';
import './style.scss'

import api from '../../../utils/api';
import Page from '../../../components/page';
import { locationTo } from '../../../utils/util';

class TeamGalleryItem extends React.PureComponent{
    state = {
        showSettings:false
    }
    render() {
        return <div className="team-item" 
                 onMouseOver={()=>{this.setState({showSettings:true})}} 
                 onMouseLeave={()=>{this.setState({showSettings:false})}}
                 onClick={() => {this.props.locationTo('/team/' + this.props._id)}}>
            <div className="left">
                <img className="bg-img" src={this.props.teamImg}></img>
                <div className="img-con"></div>
                <div className="name">{this.props.name}</div>
            </div>
            {this.state.showSettings&&<div className="right">
                <div className={this.props.marked ? "iconfont icon-collection_fill act" : "iconfont icon-collection"} 
                onClick={(e) => {this.props.starHandle(this.props._id);e.stopPropagation()}}></div>
                {this.props.managed && <div className="iconfont icon-setup" 
                onClick={(e) => {this.props.locationTo('/team-admin/' + this.props._id);e.stopPropagation()}}></div>}
            </div>}
        </div>
    }
}

class TeamListItem extends React.PureComponent{
    render() {
        return <div className="team-list-item">
            <div className="left" onClick={() => {this.props.locationTo('/team/' + this.props._id)}}>
                <img className="bg-img" src={this.props.teamImg}></img>
                <div className="img-con"></div>
                <div className="name">{this.props.name}</div>
            </div>
            <div className="right">
                <div className={this.props.marked ? "iconfont icon-collection_fill act" : "iconfont icon-collection"} onClick={() => {this.props.starHandle(this.props._id)}}></div>
                {this.props.managed && <div className="iconfont icon-setup" onClick={() => {this.props.locationTo('/team-admin/' + this.props._id)}}></div>}
            </div>
        </div>
    }
}

export default class Team extends React.Component{
    componentDidMount = async() => {
        this.initTeamList()
       
      
    }

    initTeamList = async () => {
        let result = null
        let listResult = null
        //如果过了一定时间，后端数据还没全部取回来，则显示loading图标
        setTimeout(()=>{
            if(!(listResult&&result)){            
                this._page.loading.show(true)    
            }
        },100)
 
        result = await api('/api/getMyInfo', {
            method: 'POST',
            body: {}
        })
        const teamList = result.data.userObj.teamList

        const teamIdList = []
        teamList.map((item) => {
            teamIdList.push(item.teamId)
        })
        listResult = await api('/api/team/infoList', {
            method: 'POST',
            body: {
                teamIdList: teamIdList
            }
        })
        const teamInfoList = listResult.data.teamInfoList

        teamList.map((item, idx) => {
            teamList[idx] = {
                ...item,
                ...teamInfoList[idx],
                managed: (item.role == 'creator' || item.role == 'admin')
            }
        })
        const starTeam=teamList.filter(item=>{
            return item.marked==true
        })
        const managedTeam=teamList.filter(item => {
            return item.managed == true
        })
        this.setState({
            teamList: teamList,
            starTeam: starTeam,
            managedTeam: managedTeam
        })
        //已取回全部后端数据，关闭loading图标
        this._page.loading.show(false)

    }
    getMoreManaged=async ()=>{
        console.log('more')
        this.setState({
            managedPage: this.state.managedPage + 1,
            managedFinish: (this.state.managedPage+1) * 5 >= this.state.managedTeam.length ? true : false
        })
    }
    getMoreAll=async ()=>{
        console.log('more')
        this.setState({
            allPage: this.state.allPage + 1,
            allFinish: (this.state.allPage+1) * 5 >= this.state.teamList.length ? true : false
        })
    }
    starHandle = async (_id) => {

        const teamList = this.state.teamList
        let curMarkState = false
        teamList.map((item) => {
            if(item._id == _id) {
                curMarkState = item.marked
            }
        })

        const result = await api('/api/team/markTeam', {
            method: 'POST',
            body: {
                teamId: _id,
                markState: !curMarkState
            }
        })

        if(result.state.code != 0) {
            window.toast(result.state.msg)
        } else {
            teamList.map((item) => {
                if(item._id == _id) {
                    item.marked = !item.marked
                }
            })
            const starTeam = teamList.filter(item => {
                return item.marked == true
            })
            this.setState({
                teamList: teamList,
                starTeam: starTeam
            })
        }
    }

    locationTo = (url) => {
        location.href = url
    }


    state = {
        teamList: [],
        starTeam: [],
        managedTeam:[],
        managedPage:0,
        allPage:0,
        managedFinish:false,
        allFinished:false,
    }
    render() {
        return (
            <Page title="团队 - IHCI" className="team-page" ref={page => this._page = page}>
                <div className="page-wrap">
                    <div className="main">
                        <div className="create" onClick={() => {this.locationTo('/team-create')}}> 创建团队</div>
                        {/* LHJ_DOING 把 退出团队 按钮放到 team 页面的创建团队下面  */}
                        <div className="seg">  | </div> 
                        <div className="quit" onClick={() => {location.href = '/team-management'}}>退出团队</div>
                        <div className="head" onClick={this.starHandle}>星标团队</div>
                        <div className="team-list">
                            {   
                                this.state.starTeam.map((item) => {
                                        return <TeamGalleryItem key={'mark-team' + item._id} {...item} locationTo={this.locationTo} starHandle={this.starHandle} />
                                })
                            }
                        </div>

                        <div className="head">我管理的团队</div>
                        <div className="team-list">
                            {   (()=>{
                                 let page = this.state.managedPage;
                                let currentTeam = this.state.managedTeam.slice(0,(page+1)*5);
                                return  currentTeam.map((item) => {
                                        return <TeamListItem key={'manage-team' + item._id} {...item} locationTo={this.locationTo} starHandle={this.starHandle} />
                                })
                            })()
                            }
                              <div class="load-more" onClick={this.getMoreManaged}>{this.state.managedFinish?'--没有更多了--':'加载更多'} </div>
                        </div>

                        <div className="head">我参与的团队</div>
                        <div className="team-list">
                            {   (()=>{
                                 let page = this.state.allPage;
                                 let currentTeam = this.state.teamList.slice(0, (page + 1) * 5);
                                return  currentTeam.map((item) => {
                                    return <TeamListItem key={'join-team' + item._id} {...item} locationTo={this.locationTo} starHandle={this.starHandle}  />
                                })
                            })()
                            }
                            <div class="load-more" onClick={this.getMoreAll}>{this.state.allFinish?'--没有更多了--':'加载更多'} </div>
                        </div>
                        
                    </div>
                </div>
            </Page>
        )
    }
}


