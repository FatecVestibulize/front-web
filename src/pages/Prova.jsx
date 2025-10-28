import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip'; 
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate, useParams } from 'react-router-dom'; 
import apiVestibulizeClient from "../utils/apiVestibulizeClient";
import InputTextArea from "../components/InputTextArea";
import Navbar from "../components/Navbar";

const Prova = () => {

    const navigate = useNavigate();

    const [filtro, setFiltro] = useState("");
    const [provas, setProvas] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProva, setEditingProva] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingProva, setViewingProva] = useState(null);

    useEffect(() => {
        getProvas();
    }, []);

    const getProvas = async () => {

        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};

        const response = await apiVestibulizeClient.get('exam', { 
            headers: {
                token: `${localStorage.getItem('token')}` 
            },
            params: params
        }).catch(error => {
            console.log(error.response.data.message);
            traitExpiredToken(error.response.data.message);
        });
        
        setProvas(response.data.map((item) => ({
            data: item.created_at === null ? null : new Date(item.created_at).toLocaleDateString("pt-BR"),
            titulo: item.name,
            prova_data: item.date === null ? null : new Date(item.date).toLocaleDateString("pt-BR"),
            id: item.id
        })))
    }

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingProva(item);
        setTitulo(item ? item.titulo : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProva(null);
        setTitulo("");
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingProva(null);
    }

    const handleSave = async () => {
        if (!titulo.trim()) {
            alert("O título é obrigatório!");
            return;
        }
        const dados = {
            id: editingProva ? editingProva.id : null,
            name: titulo,
            date: data + 'T00:00:00',
            description: descricao,
        };

        if (editingProva) {
            
            apiVestibulizeClient.put('exam/' + dados.id, dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                alert("Prova atualizada com sucesso!");
                getProvas();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                alert("Erro ao atualizar prova. Tente novamente.");
            }).finally(() => {
                handleCloseModal();
            });

        } else {

             apiVestibulizeClient.post('exam', dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                alert("Prova criada com sucesso!");
                getProvas();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                alert("Erro ao criar prova. Tente novamente.");
            }).finally(() => {
                handleCloseModal();
            });

        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta prova?")) {
            apiVestibulizeClient.delete('exam/' + id, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(response => {
                    alert("Prova excluída com sucesso!");
                getProvas();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                alert("Erro ao excluir prova. Tente novamente.");
            });
        }
    };

    const formStyles = {
        input: {
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#2e2e42',
            border: '1px solid #4a4a60',
            color: '#e0e0e0',
            padding: '12px 15px',
        },
        button: {
            width: '100%',
            padding: '12px 0',
            borderRadius: '8px',
            backgroundColor: '#46397d',
            border: 'none',
            color: '#e0e0e0',
            marginTop: '15px',
            fontWeight: 'bold',
            letterSpacing: '1px',
        },
    };

    const iconStyle = {
        marginLeft: '8px',
        color: '#977acfff',
        cursor: 'help',
        fontSize: '0.7em',
    };


    const modalFormJSX = (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="titulo" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Título da Prova</label>
                </div>
                <InputText
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="data" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Data da Prova</label>
                </div>
                <InputText
                    id="data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="descricao" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Descrição</label>
                </div>
                <InputTextArea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <Button
                label={editingProva ? "ATUALIZAR" : "ADICIONAR"}
                style={formStyles.button}
            />
        </form>
    );

    const viewModalJSX = viewingProva && (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            color: '#e0e0e0'
        }}>
            <p style={{ margin: 0, fontSize: '1em', color: '#c0c0c0' }}>
                Data: {viewingProva.prova_data}
            </p>
            <div style={{ 
                backgroundColor: '#2e2e42', 
                borderRadius: '8px', 
                padding: '15px', 
                border: '1px solid #4a4a60',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Descrição:</p>
                <p style={{ margin: '0 0 15px 0' }}>{viewingProva.descricao}</p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Data Limite:</p>
                <p style={{ margin: '0 0 15px 0' }}>{viewingProva.prova_data}</p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Prioridade:</p>
                <p style={{ margin: '0' }}>{viewingProva.prioridade}</p>
            </div>
        </div>
    );

    const createCardActionsGenerator = (prova) => (
        <>
            <Button 
                icon="pi pi-pencil" 
                className="p-button-text p-button-sm" 
                style={{ color: '#ffbc3fff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleOpenModal(prova); 
                }} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-text p-button-sm" 
                style={{ color: '#e05a2eff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(prova.id); 
                }} 
            />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);

        if(e.target.value.length > 3) {
            getProvas();
        }
    }

    return (
        <main style={{paddingTop: '55px', background: 'linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)', minHeight: '100vh', width: '100%' }}>
            <Navbar />
            <Header
                title="Datas de Prova"
                searchText={filtro}
                onSearchChange={(e) => handleFilterSearch(e)}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por título."
                addButtonLabel= "Adicionar Prova"
            />

            <section style={{ padding: "0 20px", maxWidth: "1000px", margin: "30px auto" }}>
                <Listagem
                    listagem={provas}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                />
            </section>

             <Modal
                 isOpen={isModalOpen}
                 onClose={handleCloseModal}
                 title={editingProva ? "Atualizar - Prova" : "Adicionar - Prova"}
             >
                 {modalFormJSX}
             </Modal>

             <Modal
                 isOpen={isViewModalOpen}
                 onClose={handleCloseViewModal}
                 title={viewingProva ? `Visualizar - ${viewingProva.titulo}` : "Visualizar Prova"}
             >
                 {viewModalJSX}
             </Modal>
        </main>
    );
};

export default Prova;