import * as PIXI from 'pixi.js';
import { EffectConfig, IEffect } from '../model/dataModel';

export default class PixilRunning implements IEffect {
  private _tickerHandler: PIXI.Ticker;
  private _stage: PIXI.Container;
  private _app: PIXI.Application;
  private _deviceIndex: Number;
  private _centerPosition: PIXI.Point;
  private _endPosition: PIXI.Point;
  private _startPosition: PIXI.Point;
  private _message: string;
  private _allDeviceWidth: number = 0;
  private _textMessageLength: number = 0;
  public isPaused: boolean;
  public isStarted: boolean;
  public _listTextShape: Array<{ text: PIXI.Text, endPosition: PIXI.Point, startPosition: PIXI.Point }>;
  _positionText: PIXI.Text;
  constructor(canvas: HTMLCanvasElement, private effectConfig: EffectConfig) {
    //http://pixijs.download/release/docs/PIXI.Application.html
    this._app = new PIXI.Application({
      width: canvas.width,
      height: canvas.height,
      view: canvas
    });
    this._stage = this._app.stage;
    this.effectConfig.allDevices.sort((a, b) => a.position - b.position);
    this.init();
  }


  private init() {
    this._centerPosition = new PIXI.Point();
    this._startPosition = new PIXI.Point();
    this._endPosition = new PIXI.Point();
    this._allDeviceWidth = 0;
    this._message = this.effectConfig.message;
    this._textMessageLength = this._message.length * this.effectConfig.font_size / 2;

    //tinh' so luong. text se hien thi. trong mot man` hinh`
    let allDeviceLength = 0;
    console.log(': PixilRunning -> privateinit -> this.effectConfig.allDevices', this.effectConfig)
    this.effectConfig.allDevices.forEach(item => {
      allDeviceLength += item.size.width;
    })
    let numberText = Math.round((allDeviceLength) / (this._textMessageLength + this.effectConfig.distance_text)) + 2;
    if (numberText < 1) numberText = 1
    this._deviceIndex = this.effectConfig.allDevices.findIndex(o => o.id === this.effectConfig.currentDevice.id);
    console.log(': PixilRunning -> privateinit -> this._deviceIndex', this._deviceIndex)
    this._centerPosition.x = this.effectConfig.currentDevice.size.width / 2;
    this._centerPosition.y = this.effectConfig.currentDevice.size.height / 2;

    //tinh' vi. tri' ket thuc' cua? text  vi. tri' ma` khi text chay. qua tat' cac? cac' man` hinh` cua thiet bi hien tai

    this._endPosition.x -= this._textMessageLength;
    for (var index = 0; index < this.effectConfig.allDevices.length; index++) {
      const device = this.effectConfig.allDevices[index];
      const deviceIndex = this.effectConfig.allDevices.findIndex(o => o.id === device.id);
      if (this._deviceIndex <= deviceIndex) {
        this._startPosition.x += device.size.width + this.effectConfig.distance_device;
      } else {
        this._endPosition.x -= (device.size.width + this.effectConfig.distance_device);
      }
      this._allDeviceWidth += device.size.width;
      this._allDeviceWidth += this.effectConfig.distance_device * this.effectConfig.totalDevice;
    }
    this._startPosition.y = this._centerPosition.y - this.effectConfig.font_size / 2;
    this._endPosition.y = this._centerPosition.y - this.effectConfig.font_size / 2;
    var background = new PIXI.Graphics();
    background.beginFill(this.effectConfig.stringToColor(this.effectConfig.bg_color));
    background.drawRect(0, 0, this.effectConfig.currentDevice.size.width, this.effectConfig.currentDevice.size.height);
    background.endFill();
    this._stage.addChild(background);

    // tao. mang? cac' text chay. lien tuc. (ko phai? cach' hay :))
    this._listTextShape = new Array(numberText);
    var style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: this.effectConfig.font_size,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: this.effectConfig.textGradientColor, // gradient
      stroke: '#4a1850',

    });
    for (let index = 0; index < numberText; index++) {
      const textShape = new PIXI.Text(this._message, style);
      this._listTextShape[index] = {
        text: textShape,
        startPosition: new PIXI.Point(this._startPosition.x + index * (this._textMessageLength + this.effectConfig.distance_text), this._startPosition.y),
        endPosition: new PIXI.Point(this._endPosition.x, this._endPosition.y)
      }
      textShape.x = this._listTextShape[index].startPosition.x;
      textShape.y = this._listTextShape[index].startPosition.y;
    }
  }
  createPostionText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: this.effectConfig.font_size,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: "#ffffff"
    })
    this._positionText = new PIXI.Text(this.effectConfig.currentDevice.position.toString(), style);
    this._positionText.x = 10;
    this._positionText.y = 5;
  }
  start(config?: any) {
    if (this.isStarted) {
      this.stop();
    }
    this.isPaused = false;
    this.isStarted = true;
    this._listTextShape.forEach(item => {
      this._stage.addChild(item.text);
    })
    this._tickerHandler = this._app.ticker.add(this.tick, this);
    return true;
  }
  tick(event: any) {
    if (this.isPaused) {
      return;
    }
    this._listTextShape.forEach((item, index) => {
      item.text.x = item.text.x - this.effectConfig.speed;
      if (item.text.x < item.endPosition.x) {
        //quay tro? lai. vi. tri' bat' dau`
        item.text.x = this._startPosition.x;
        // neu' co' nhieu` hon 1 text thi` no'i duoi text tiep theo vao`
        if (this._listTextShape.length > 1) {
          //vi. tri' text` cach' vi. tri' hien tai. so thiet' bi.
          let nextIndex = index + this._listTextShape.length - 1;
          nextIndex = (nextIndex > this._listTextShape.length - 1) ? nextIndex - this._listTextShape.length : nextIndex;
          const lastText = this._listTextShape[nextIndex];
          if (item.text.x < lastText.text.x + this.effectConfig.distance_text + this._textMessageLength) {
            item.text.x = lastText.text.x + this.effectConfig.distance_text + this._textMessageLength;
          }
        }
      }
    })
  }
  stop() {
    if (!this.isStarted) return false;
    this.isPaused = false;
    this.isStarted = false;
    this._listTextShape.forEach(element => {
      if (element && element.text) this._stage.removeChild(element.text)
      element.text = null;
    });
    this._listTextShape = [];
    this._tickerHandler.stop();
    return true;
  }
  pause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this._tickerHandler.stop();
    } else {
      this._tickerHandler.start();
    }
    return this.isPaused;
  }
}