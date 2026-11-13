package br.com.projeto.repository;

import java.util.List;

import br.com.projeto.model.Categoria;
import br.com.projeto.model.Transacao;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByDescricaoContainingIgnoreCase(String descricao);

    List<Transacao> findByDescricaoContainingIgnoreCase(String descricao, Sort sort);

    List<Transacao> findByCategoria(Categoria categoria);

    boolean existsByCategoriaId(Long categoriaId);
}
