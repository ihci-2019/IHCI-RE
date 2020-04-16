import * as React from 'react';
import BraftEditor from 'braft-editor'
import './braft.scss'
import './style.scss'
import fileUploader from '../../utils/file-uploader'
import {
    create
} from '../../../../server/components/uuid/uuid'

export default class Beditor extends React.Component{

    openFileInput = () => {
        this.fileInput.click()
    }
    //由于图片上传、 视频上传项目中都是单独走的接口， 需要一个上传的方法
   async myUploadFn (param){

         console.log('param',param);
         var nameParts = param.file.name.split('.')
         var ossKey =  '/imageStatic/' + create() + '.' + nameParts[nameParts.length - 1]
         const resp = await fileUploader(param.file, ossKey)
         console.log(resp.name)
         console.log(window.location.origin)
         param.success({
             url: window.location.origin+'/static' + resp.name,
             meta: {
                 id: ossKey,
                 title: resp.name,
                 alt: resp.name,
                 loop: false, // 指定音视频是否循环播放
                 autoPlay: false, // 指定音视频是否自动播放
                 controls: false, // 指定音视频是否显示控制栏
                 poster: '', // 指定视频播放器的封面
             }
         })

    };
    render() {
        const _props = this.props

        const editorProps = {
            height: 200,
            contentFormat: 'html',
            initialContent: _props.content,
            onChange: _props.handleContentChange,
            controls: [
                'undo', 'redo', 'split', 'font-size', 
                'text-color', 'bold', 'italic', 'underline', 'strike-through',
                'emoji', 'text-align', 'split', 'headings', 'list_ul',
                'list_ol', 'blockquote', 'hr', 'remove-styles', 'clear'
            ],
            extendControls: [
                {
                    type: 'button',
                    text: 'Hello',
                    html: '附件',
                    hoverTitle: '上传文件!',
                    className: 'preview-button',
                    onClick: () => this.openFileInput()
                }
            ]
        }
    
        return (
            <div>
                <input style={{display: "none"}}
                       type="file"
                       ref={(fileInput) => this.fileInput = fileInput}
                       onChange={_props.handleFileUpload}>
                </input>

                < BraftEditor {
                    ...editorProps
                }
                media = {
                    {
                        uploadFn: this.myUploadFn
                    }
                }
                />

                <div className="editor-file-list">
                    {
                        _props.attachments&&_props.attachments.map((item, index) => {
                            return( <div className="file-item" key={"file-name"+item.name}>
                                {item.name}
                                <i className="icon iconfont" onClick={_props.deleteFile.bind(index)}>&#xe70b;</i>
                            </div> )
                        })
                    }
                </div>
            </div>
        )
    }
}