class DoublePendulum {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 物理参数
        this.L1 = 150;
        this.L2 = 150;
        this.m1 = 10;
        this.m2 = 10;
        this.g = 9.81;
        this.timeScale = 1.0;
        
        // 状态变量
        this.theta1 = Math.PI/2;
        this.theta2 = Math.PI/2;
        this.omega1 = 0;
        this.omega2 = 0;
        
        // 动画参数
        this.trail = [];
        this.trail1 = [];
        this.trailLength = 50;
        this.trailLength1 = 50;
        this.isAnimating = false;
        this.lastTime = 0;
    }

    update(dt) {
        // 拉格朗日方程求解
        const num1 = -this.g*(2*this.m1 + this.m2)*Math.sin(this.theta1);
        const num2 = -this.m2*this.g*Math.sin(this.theta1 - 2*this.theta2);
        const num3 = -2*Math.sin(this.theta1 - this.theta2)*this.m2*(this.omega2*this.omega2*this.L2 + this.omega1*this.omega1*this.L1*Math.cos(this.theta1 - this.theta2));
        const den = this.L1*(2*this.m1 + this.m2 - this.m2*Math.cos(2*this.theta1 - 2*this.theta2));
        const alpha1 = (num1 + num2 + num3) / den;

        const num4 = 2*Math.sin(this.theta1 - this.theta2);
        const num5 = this.omega1*this.omega1*this.L1*(this.m1 + this.m2);
        const num6 = this.g*(this.m1 + this.m2)*Math.cos(this.theta1);
        const num7 = this.omega2*this.omega2*this.L2*this.m2*Math.cos(this.theta1 - this.theta2);
        const alpha2 = (num4*(num5 + num6 + num7)) / (this.L2*(2*this.m1 + this.m2 - this.m2*Math.cos(2*this.theta1 - 2*this.theta2)));

        // Verlet积分
        const scaledDt = dt * this.timeScale;
        
        const prevTheta1 = this.theta1;
        const prevTheta2 = this.theta2;
        
        this.theta1 += this.omega1 * scaledDt + 0.5 * alpha1 * scaledDt * scaledDt;
        this.theta2 += this.omega2 * scaledDt + 0.5 * alpha2 * scaledDt * scaledDt;
        
        const newAlpha1 = (num1 + num2 + num3) / den;
        const newAlpha2 = (num4*(num5 + num6 + num7)) / (this.L2*(2*this.m1 + this.m2 - this.m2*Math.cos(2*this.theta1 - 2*this.theta2)));
        
        this.omega1 += 0.5 * (alpha1 + newAlpha1) * scaledDt;
        this.omega2 += 0.5 * (alpha2 + newAlpha2) * scaledDt;
    }

    draw() {
        const {width, height} = this.canvas;
        const pivotX = width/2;
        const pivotY = height/3;

        // 计算摆臂端点坐标
        const x1 = pivotX + this.L1 * Math.sin(this.theta1);
        const y1 = pivotY + this.L1 * Math.cos(this.theta1);
        const x2 = x1 + this.L2 * Math.sin(this.theta2);
        const y2 = y1 + this.L2 * Math.cos(this.theta2);

        // 保存轨迹
        this.trail.push({x: x2, y: y2});
        this.trail1.push({x: x1, y: y1});
        if(this.trail.length > this.trailLength) this.trail.shift();
        if(this.trail1.length > this.trailLength1) this.trail1.shift();

        // 清空画布
        this.ctx.clearRect(0, 0, width, height);

        // 绘制第二个摆锤轨迹
        this.ctx.beginPath();
        this.trail.forEach((pos, i) => {
            this.ctx.globalAlpha = i/this.trailLength;
            this.ctx.lineTo(pos.x, pos.y);
        });
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 绘制第一个摆锤轨迹
        this.ctx.beginPath();
        this.trail1.forEach((pos, i) => {
            this.ctx.globalAlpha = i/this.trailLength1;
            this.ctx.lineTo(pos.x, pos.y);
        });
        this.ctx.strokeStyle = '#4D9DE0';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 绘制摆臂
        this.ctx.globalAlpha = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(pivotX, pivotY);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // 绘制质点
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, Math.sqrt(this.m1)*3, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, Math.sqrt(this.m2)*3, 0, Math.PI*2);
        this.ctx.fill();
    }

    reset() {
        this.theta1 = Math.PI/2;
        this.theta2 = Math.PI/2;
        this.omega1 = 0;
        this.omega2 = 0;
        this.trail = [];
        this.trail1 = [];
        this.timeScale = 1.0;
    }

    animate(timestamp) {
        if(!this.isAnimating) return;
        
        const dt = (timestamp - this.lastTime)/1000 || 0;
        this.lastTime = timestamp;
        
        this.update(dt);
        this.draw();
        requestAnimationFrame((t) => this.animate(t));
    }
}

// 初始化模拟器
const canvas = document.getElementById('pendulumCanvas');
const pendulum = new DoublePendulum(canvas);

// 控件事件监听
document.getElementById('restart').addEventListener('click', () => {
    pendulum.reset();
    pendulum.isAnimating = true;
    requestAnimationFrame((t) => pendulum.animate(t));
});

// 参数更新监听
['length1', 'length2', 'mass1', 'mass2', 'timeScale', 'timeScaleValue'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
        if(id === 'timeScale' || id === 'timeScaleValue') {
            const slider = document.getElementById('timeScale');
            const input = document.getElementById('timeScaleValue');
            slider.value = input.value = e.target.value;
            pendulum.timeScale = parseFloat(e.target.value);
            return;
        }
        const value = parseFloat(e.target.value);
        switch(id) {
            case 'length1': pendulum.L1 = value; break;
            case 'length2': pendulum.L2 = value; break;
            case 'mass1': pendulum.m1 = value; break;
            case 'mass2': pendulum.m2 = value; break;
        }
    });
});

// 启动动画
pendulum.isAnimating = true;
requestAnimationFrame((t) => pendulum.animate(t));