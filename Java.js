const data = (new function(){
	let int=0;
	const arr={};
	this.create=obj=>{
		obj.Id=int++;
		arr[obj.Id]=obj;
		return obj;
	}
	this.getAll=()=>{
		return Object.values(arr);
	}
	this.get=id=>arr[id];
	this.update=obj=>{
		arr[obj.Id]=obj;
		return obj;
	}
	this.delete=id=>{
		delete arr[id];
	}
});
data.create({
    fio: "Стулов Д.А.",
	kyrs: "1",
    date: "19.01.2003",
    forma: "Бюджет",
});
const util = new function(){
	this.parse=(tpl, obj)=>{
		let str=tpl;
		for (let k in obj){
			str=str.replaceAll("{"+k+"}",obj[k]);
		}
		return str;
	};
	this.id=el=>document.getElementById(el);
	this.q=el=>document.querySelectorAll(el);
	this.listen=(el, type, callback) => el.addEventListener(type, callback);
}
const student=new function(){
	this.submit=()=>{
		const st = {
			fio: util.id("fio").value,
			kyrs: util.id("kyrs").value,
			date: util.id("date").value,
			forma: util.id("forma").value,
		};
		if(util.id("Id").value == "-1") data.create(st)
		else {
			st.Id = util.id("Id").value;
			data.update(st);
		}
		this.render();
		util.id("table1_2").style.display="none";
	};
	this.remove=()=>{
		data.delete(activeStudent);
		activeStudent = null;
		this.render();
		util.id("table2_2").style.display = "none";
	};
	const init=()=>{
		this.render();
		util.q(".dobavit_p").forEach(el=>{
			util.listen(el,"click",add);
		});
		util.q(".close, .close_net").forEach(el=>{
			util.listen(el,"click",()=>{
				util.id(el.dataset["id"]).style.display="none";
			});
		});
		util.q(".register").forEach(el=>{
			util.listen(el,"click",()=>{
				this[el.dataset["func"]]();
			});
		});
	};

	const add=()=>{
		
		util.q("#table1_2 form")[0].reset();
		util.id("Id").value="-1";
		util.id("table1_2").style.display="block";
	};

	const edit=el=>{
		util.q("#table1_2 form")[0].reset();
		const st = data.get(el.dataset["id"]);
        for(let k in st){
            util.id(k).value = st[k];
        }
		util.id("table1_2").style.display="block";
	};	
	let activeStudent=null;
	const rm = el => {
        util.id("table2_2").style.display = "block";
        activeStudent = el.dataset["id"];
    };
    const listeners = {edit: [], rm:[]};
    const clearListener = ()=>{
        listeners.edit.forEach(el=>{
            el.removeEventListener("click",edit);
        });
        listeners.rm.forEach(el=>{
            el.removeEventListener("click",rm);
        });
        listeners.edit = [];
        listeners.rm = [];
    };
    const addListener = ()=>{
        util.q(".edit").forEach(el=>{
            listeners.edit.push(el);
            util.listen(el, "click", ()=>edit(el));
        });
        util.q(".rm").forEach(el=>{
            listeners.rm.push(el);
            util.listen(el, "click", ()=>rm(el));
        });
    };
    this.render = () => {
        clearListener()
        util.id("tbl").innerHTML = data
            .getAll()
            .map(el => util.parse(tpl, el)).join("");
        addListener();
    };
	const tpl= `
		<tr>
		<td>{fio}</td>
		<td>{kyrs}</td>
		<td>{date}</td>
		<td>{forma}</td>
		<td>
			<input type="button" id="knopki" class="edit" data-id="{Id}" value="изменить">
			<input type="button" id="knopki" class="rm" data-id="{Id}" value="удалить">
		</td>
		</tr>
	`;

	window.addEventListener("load",init);
}